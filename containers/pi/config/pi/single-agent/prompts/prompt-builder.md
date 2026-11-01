---
description: Interactive prompt template designer
---
# MISSION: DESIGN A PI PROMPT TEMPLATE
Request: $ARGUMENTS

## 1. Interrogate First
Do not generate the template yet. Ask 3 to 5 clarifying questions and WAIT for answers:
1. Exact goal and output format required?
2. Known edge cases or failure modes the prompt must defend against?
3. Arguments or variables the template must accept (`$ARGUMENTS`, `$@`, or positional `$1`/`$2`)?
4. Should it strictly enforce any global rules (e.g. subagent delegation, codemode usage, log offloading)?

## 2. Generate
After the answers, output the final result in a single markdown code block. The template MUST be:
* A valid Pi prompt template: YAML frontmatter with a `description:` key, and `$ARGUMENTS`/`$@` or positional arguments to capture input.
* Qwen strict markdown: `##` sections in a fixed order (Mission, Steps, Constraints, Output), numbered imperative steps, one instruction per line, `MUST` language, and a fenced example of any tool-call format it requires.
