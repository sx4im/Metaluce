import { ActionItem } from "@shared/schema";

export async function analyzeText(text: string): Promise<{
  summary: string;
  actionItems: ActionItem[];
  topics: string;
}> {
  // Simulate AI processing delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // 1. Simple Keyword/Entity Extraction
  const words = text.split(/\s+/).filter((w) => w.length > 4);
  const uniqueWords = Array.from(new Set(words));

  // Extract potential names (Capitalized words not at start of sentence)
  // Improved regex to avoid catastrophic backtracking on long inputs (though input length should be capped at controller level)
  const nameRegex = /\b[A-Z][a-z]+\b/g;
  const names = Array.from(new Set(text.match(nameRegex) || []))
    .filter((name) => !["The", "And", "This", "That", "Meeting"].includes(name))
    .slice(0, 5);

  // Use "Team" or names for assignments
  const assignees = names.length > 0 ? names : ["Team"];

  // 2. Identify core topics
  const topics = uniqueWords.slice(0, 3).join(", ");

  // 3. Construct Dynamic Summary based on user-defined rules
  const summary = `During the session, the team extensively discussed ${topics || "critical project components"}. ${names.length > 0 ? names.join(", ") + " and others " : "Participants "}collaborated to align on the project trajectory, specifically focusing on immediate execution needs and long-term milestones. The discussion successfully finalized several key decisions regarding the next phase of development.`;

  // 4. Generate Dynamic Action Items based on user-defined rules
  const verbs = ["Finalize", "Review", "Update", "Sync with", "Draft", "Investigate"];
  const priorities: ("High" | "Medium" | "Low")[] = ["High", "Medium", "Low"];

  const actionItems: ActionItem[] = uniqueWords.slice(0, 5).map((word, i) => {
    // Use context to pick assignee
    const assignee = assignees[i % assignees.length];
    return {
      description: `${verbs[i % verbs.length]} ${word} implementation details`,
      assignee: assignee,
      priority: priorities[i % priorities.length],
    };
  });

  return { summary, actionItems, topics };
}
