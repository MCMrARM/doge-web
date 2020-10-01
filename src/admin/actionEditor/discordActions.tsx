import {ArrayVariableType, SetVariableType, VariableType} from "./actions";

export const GuildVariableType = new SetVariableType("member", {
    members: new VariableType("members")
});

export const MemberVariableType = new SetVariableType("member", {
    displayName: VariableType.STRING
});

GuildVariableType.children["members"] = new ArrayVariableType(MemberVariableType);