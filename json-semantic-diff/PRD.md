# Product Requirements Document: JSON Semantic Differ

## 1. Executive Summary
**Project Name:** JSON Semantic Differ
**Concept:** A developer tool that performs semantic comparison of JSON objects, ignoring irrelevant differences like key ordering and whitespace, while highlighting meaningful changes in structure, types, and values.
**The Viral Hook:** "The diff tool that ignores whitespace and key order."

## 2. Problem Statement & The Gap
**Why not just use VS Code or an Online Formatter?**

Most developers currently use one of these two workflows, both of which are flawed:

1.  **Text-Based Diffs (VS Code, GitHub, `diff`):**
    *   **The Problem:** These tools compare *lines of text*.
    *   **Failure Mode:** If Key A is on line 1 in file A, and on line 10 in file B, the diff shows 2 changes (1 removal, 1 addition). This is "False Positive" noise.
    *   **Result:** You waste time scanning 50 lines of red/green just to check if a value changed.

2.  **Online JSON Formatters (JSONDiff.com, etc):**
    *   **The Problem:** Many handle sorting, but lack deep semantic control.
    *   **Failure Mode:**
        *   **Type Blindness:** They often treat `100` and `"100"` as the same or just a text change without highlighting the *type* danger.
        *   **Rigid Arrays:** They almost strictly compare arrays by index `[0]` vs `[0]`. If an item shifts from index 0 to 1, the entire array shows as invalid.
        *   **Privacy functionality:** Most are server-side or unverified/closed source client-side, making them unsafe for sensitive production headers/data.

**Our Solution (The differentiation):**
*   **Structure-Aware:** We parse the object, not the text.
*   **Zero-Config "Canonicalization":** We automatically sort keys purely for the comparison engine, without you needing to click "Sort" first.
*   **"Array as Set" Logic:** The specific ability to say "I don't care about the order of this list, just tell me if the *contents* are the same." This is our primary differentiator.

## 3. Target Audience
- **Backend Developers:** Comparing API responses between environments (Staging vs. Prod).
- **Frontend Developers:** Debugging large state objects (Redux/Zustand) or component props.
- **DevOps Engineers:** Comparing infrastructure-as-code configurations (Terraform state, Kubernetes manifests converted to JSON).
- **QA Engineers:** Verifying test outputs against expected semantic payloads.

## 4. detailed Use Cases

### 4.1. API Regression Testing
**Scenario:** A developer refactors a backend endpoint. The JSON serializer changes the order of keys in the response.
**Current Pain:** `diff` shows the entire file has changed.
**Solution:** JSON Semantic Differ shows "No Changes found", giving the developer confidence to deploy.

### 4.2. Configuration Drift Detection
**Scenario:** Comparing two complex JSON configuration files (e.g., VS Code settings, accumulated localized translations).
**Use Case:** Identifying exactly which flag changed from `true` to `false` without wading through 500 lines of reordered keys.

### 4.3. Data Migration Verification
**Scenario:** Migrating data from MongoDB to Postgres, exporting as JSON to verify fidelity.
**Use Case:** Ensuring that data types (Integers staying Integers, not becoming Floats or Strings) are preserved during migration.

### 4.4. Debugging Webhooks
**Scenario:** A receive webhook payload looks different.
**Use Case:** Quickly pasting the "Expected" vs "Actual" payload to see if a nested field was dropped or renamed.

### 4.5. Large Dataset Comparison
**Scenario:** Comparing large JSON dumps (MBs in size).
**Use Case:** Filtering view to "Show only changes" to instantly isolate the 3 fields that differ in a 10,000 line file.

## 5. Feature Requirements

### 5.1. Core Features (MVP)
- **Side-by-Side View:** Classic split view (Left: Original, Right: Modified).
- **Semantic Comparison:**
    - Ignore Key Order (Object keys are unsorted sets).
    - Ignore Whitespace (prettified vs minified).
- **Line-by-Line visual alignment:** Even if keys are reordered in the raw file, the visualizer should align matching keys.
- **Change Highlighting:**
    - Green: Added keys/values.
    - Red: Removed keys/values.
    - Yellow/Orange: Modified values.
- **Type Change Detection:** Explicitly flag if a value changed from `Int` to `String` (e.g., `id: 123` -> `id: "123"`).

### 5.2. Developer Utility Enhancements (The "Wow" Factor)
- **"Ignore Array Order" Toggle:** Sometimes lists of items (tags, ids) are semantically sets. a toggle to treat arrays as sets (ignore order).
- **Deep Sort Export:** A button to "Canonicalize" the JSON (recursively sort keys) and copy it to clipboard. This allows users to fix their chaotic files.
- **JSON Path Navigation:** Click a changed node to get its JSONPath (e.g., `users[0].address.zip`).
- **Folding/noise reduction:** "Hide Unchanged" mode to collapse all matching nodes and show only the diffs.
- **Syntax Highlighting:** Full color coding for keys, strings, numbers, booleans.
- **Error Tolerance:** If the input is slightly invalid JSON (trailing commas), try to parse it anyway (using a permissive parser like `json5`).

### 5.3. Future Scope
- **Shareable URLs:** Save the diff state to a Gist or encoded URL parameter for easy sharing on Slack/Teams.
- **CLI Tool:** `npx json-semantic-diff file1.json file2.json`.
- **Patch Generation:** Export a JSON Patch (RFC 6902) document describing the transformation.

## 6. Test Cases (Acceptance Criteria)

| Scenario | Input A | Input B | Expected Outcome |
| :--- | :--- | :--- | :--- |
| **Key Reordering** | `{"a":1, "b":2}` | `{"b":2, "a":1}` | **No Changes Detected.** App reports "Identical Semantics". |
| **Whitespace** | `{"a": 1}` | `{"a":1}` (minified) | **No Changes Detected.** |
| **Type Mismatch** | `{"id": 1}` | `{"id": "1"}` | **Change Detected.** Highlight value. Tooltip: "Type changed from Number to String". |
| **Nested Reorder** | `{"x": {"a":1, "b":2}}` | `{"x": {"b":2, "a":1}}` | **No Changes Detected.** Deep comparison works. |
| **Array Order (Standard)** | `[1, 2]` | `[2, 1]` | **Change Detected.** Arrays are ordered by default. |
| **Array Order (Ignored)** | `[1, 2]` | `[2, 1]` | **No Change** (Only if "Treat Arrays as Sets" is enabled). |
| **Missing Key** | `{"a": 1, "b": 2}` | `{"a": 1}` | **Change Detected.** "b" highlighted as Removed (Red). |
| **New Key** | `{"a": 1}` | `{"a": 1, "c": 3}` | **Change Detected.** "c" highlighted as Added (Green). |
| **Float Precision** | `{"v": 1.0}` | `{"v": 1}` | **No Change** (Javascript treats `1.0` and `1` as identical numbers usually, but strict mode might differentiate). *Decision: Treat as Identical.* |

## 7. Technical Stack Recommendation
- **Framework:** React (Vite)
- **Styling:** TailwindCSS (for rapid UI development) + Lucide React (Icons).
- **State:** Zustand (if complex local state needed) or simple React Context.
- **Diff Logic:**
    - Custom recursive comparator or specialized library (e.g. `fast-deep-equal` for checks, but we need *diff generation*).
    - `microdiff` is fast but might need enhancement for exact line mapping.
    - **Recommended:** `diff` package (npm) or `jsondiffpatch` for robust delta generation.
- **Editor:** `monaco-editor` or `react-codemirror` for the input areas (provides syntax highlighting/folding out of the box).
