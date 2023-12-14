import { workspace } from "vscode";

export function getRegexRuleList(): RegExp[] {
    return workspace.getConfiguration("yaml-links-support")
        .get<string[]>("rules")!
        .map(rule => new RegExp(rule, "g"));
}

export function getSupportFileTypes(): string[] {
    return workspace.getConfiguration("yaml-links-support")
        .get<string[]>("file-types")!;
}