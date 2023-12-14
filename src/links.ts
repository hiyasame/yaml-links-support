import { readdirSync, statSync } from "fs";
import path from "path";
import { CancellationToken, DocumentLink, DocumentLinkProvider, ProviderResult, Range, TextDocument, Uri, window, workspace } from "vscode";
import { getRegexRuleList } from "./config";

export class LinkProvider implements DocumentLinkProvider {
    provideDocumentLinks(document: TextDocument, token: CancellationToken): ProviderResult<DocumentLink[]> {
        return getRegexRuleList()
            .flatMap(rule => match(document, rule));
    }
}

function match(doc: TextDocument, regex: RegExp): DocumentLink[] {
    const text = doc.getText();
    const matches = [...text.matchAll(regex)];
    console.log(matches);
    // match 到了就从 workspace 扫文件
    return matches.map(match => {
        const filename = match.groups!["file"] ? match.groups!["file"] : match[0];
        const start = match.index! + match.indexOf(filename);
        const end = start! + filename.length;
        const workspaceFolder = workspace.getWorkspaceFolder(doc.uri)!.uri.fsPath;
        const linkedFile = findTargetFile(workspace.getWorkspaceFolder(doc.uri)!.uri.fsPath, filename);
        const link = new DocumentLink(
            new Range(
                doc.positionAt(start),
                doc.positionAt(end)
            ),
            linkedFile ? Uri.file(linkedFile) : undefined
        );
        link.tooltip = linkedFile ? path.relative(workspaceFolder, linkedFile) : undefined;
        return link;
    }).filter(docLink => docLink.target);
}

// 从workspace开始找文件
function findTargetFile(dirPath: string, target: string): string | undefined {
    const files = readdirSync(dirPath);
    for (let file of files) {
        const filePath = path.join(dirPath, file);
        const fstat = statSync(filePath);
        if (fstat.isDirectory()) {
            let ret = findTargetFile(filePath, target);
            if (ret) {
                return ret;
            }
        } else if (file === target) {
            return filePath;
        }
    }
}