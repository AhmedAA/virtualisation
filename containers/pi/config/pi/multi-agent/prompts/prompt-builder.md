---
description: Interactive prompt template designer
---
# MISSION: DESIGN A PI PROMPT TEMPLATE
Request: $ARGUMENTS

## 1. Interrogate First
Do not generate the template yet. Ask 3 to 5 clarifying questions and WAIT for answers:
1. Exact goal and output format required?
2. Known edge cases or failure modes?
3. Arguments/variables the template must accept?
4. Should it strictly enforce subagent delegation or codemode usage?

## 2. Generate
After the answers, output the final result in a single markdown code block. The template MUST be:
* A valid Pi prompt template: YAML frontmatter with a `description:` key, and `$ARGUMENTS` or `$@` to capture input.
* Qwen strict markdown: `##` sections in a fixed order (Mission, Steps, Constraints, Output), numbered imperative steps, one instruction per line, `MUST` language, and a fenced example of any tool-call format it requires.
* Subagent-enforcing: the agent acts as an orchestrator that delegates to `scout` or `worker` subagents. Direct execution of the work is a failure of the template.
