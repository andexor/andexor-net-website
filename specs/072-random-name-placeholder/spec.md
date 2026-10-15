# Feature Specification: Random Name Placeholder

**Feature Branch**: `65-random-name-placeholder`

**Created**: 2026-10-15

**Status**: Draft

**Input**: User description: "Generate a list of 100 random names from a variety of ethnic backgrounds. Use only
English. Only a full first and last name, no middle names, no initials. When the Contact Us popup is displayed, select
a random entry from this list as the placeholder text for the Full name field so that it gets a different value each
time. Do not worry about the probability of how often names are selected or their distribution."

Follows spec 001 (the Contact Us popup and its four fields) and spec 070 (the current field order). The Full name
placeholder is today the fixed example "Jordan Reyes".

## User Scenarios & Testing *(mandatory)*

### User Story 1 - The Full name example changes each time the popup opens (Priority: P1)

A visitor opens the Contact Us popup. The empty Full name field shows a grey example name, such as "Priya Sharma". They
close the popup and open it again, and the example is probably a different name, such as "Kwame Mensah". The examples
come from a fixed list of 100 names drawn from many backgrounds, so a visitor is likely to see a name that looks like
theirs. Nothing else about the popup changes.

**Why this priority**: This is the owner's whole request. A single fixed example tells every visitor what a "normal"
name looks like. A rotating set from many backgrounds is more welcoming.

**Independent Test**: Open the Contact Us popup, read the Full name placeholder, close, and repeat several times. Every
value read is one of the 100 names in the list below, and the values are not all the same.

**Acceptance Scenarios**:

1. **Given** the Contact Us popup is closed, **When** it is opened, **Then** the Full name field is empty and its
   placeholder is exactly one name from the list below.
2. **Given** the popup has been opened and closed many times, **When** the placeholders seen are compared, **Then**
   more than one distinct name has been shown.
3. **Given** the popup is open, **When** the visitor types in the Full name field, **Then** the placeholder is replaced
   by what they type, and when they clear the field the same placeholder returns (it does not change while the popup
   stays open).
4. **Given** the popup was sent and then opened again, **When** it is displayed, **Then** a placeholder is chosen anew
   for that display.
5. **Given** the popup is open, **When** a screen reader or the keyboard is used, **Then** the field keeps its label
   "Full name" and its Tab position, and the placeholder is not the field's label.

---

### Edge Cases

- The same name may come up twice in a row. The owner has said the distribution does not matter, so no effort is made to
  avoid repeats.
- The name is only an example and is never sent or saved. If the visitor leaves the field empty, the form is still
  blocked by the browser, as today (spec 001 FR-010), and the placeholder is not submitted as a value.
- The page is built ahead of time as static files. The placeholder is chosen when the popup is displayed in the
  visitor's browser, not when the site is built, so that each visitor and each display gets its own name. The page the
  visitor first loads must not change or show a mismatch because of it.
- If the choice cannot be made for any reason, the field still shows a name from the list. It is never blank.
- Every name is two words, plain English letters, with no apostrophes, hyphens, accents, or other special characters,
  so the placeholder displays the same everywhere and follows the site's straight-quote rule.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The site MUST hold one list of exactly 100 names, the list in this spec. Each entry is a first name and a
  last name only: no middle name, no initial, no title, no suffix.
- **FR-002**: Each time the Contact Us popup is displayed, the Full name field's placeholder MUST be one entry chosen at
  random from the list. A different entry may be chosen on each display. Chances of selection and distribution are not
  specified.
- **FR-003**: The chosen name MUST stay the same for as long as that display of the popup stays open, including while
  the visitor types and clears the field.
- **FR-004**: The field's label, required marking, Tab order, autofocus, and reset-on-reopen behavior MUST NOT change
  (specs 001, 068, 069, 070). Only the placeholder text changes.
- **FR-005**: The placeholder MUST NOT be sent as the field's value, and MUST NOT be used as the field's label or
  accessible name.
- **FR-006**: The list MUST contain English text only, with each name made of two words of plain letters, so that no
  entry has an apostrophe, hyphen, accent, or other special character.
- **FR-007**: The list MUST have no duplicate entries and no entry that is a real, widely known public figure.
- **FR-008**: The site's static build and the first page load MUST work as before, with no hydration warning or
  mismatch caused by the random choice.
- **FR-009**: Tests MUST check that the list is made only of two-word, plain-letter names with no duplicates; that the
  placeholder shown on open is a member of the list; that more than one name is shown over repeated displays; and that
  it does not change while the popup stays open. Tests MUST NOT assert how many names are in the list (the owner's
  rule against count assertions), and MUST NOT depend on a particular random outcome.
- **FR-010**: The design documents and the UI kit that show the Full name placeholder (`design/README.md`,
  `design/ui_kits/marketing-site/`, `design/_ds_bundle.js`) MUST say that the example is a random name from a list,
  not a fixed name, and spec 001's description of the field MUST be amended in the style it already uses for
  superseded requirements.
- **FR-011**: The build and every existing test MUST still pass, with no new accessibility violations.

### Key Entities

- **Example Name List**: 100 first-and-last-name pairs from many backgrounds, used only as display text for the Full
  name placeholder. It is not customer data and is never transmitted.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Every time the popup is displayed, the Full name field shows an example name from the list, and it is
  never blank.
- **SC-002**: Across 50 displays of the popup, more than one distinct name appears.
- **SC-003**: No visitor can tell any difference in the popup other than the example name: the form's layout, labels,
  keyboard order, and sending behavior are as before.
- **SC-004**: The automated accessibility check reports no new violation.

## Assumptions

- "A variety of ethnic backgrounds" is met by a balanced spread of names that are common in English-speaking countries
  and among their diaspora communities: English, Irish, Hispanic and Latin American, African American, West and East
  African, Arabic, Persian, Turkish, South Asian, Chinese, Japanese, Korean, Vietnamese, Southeast Asian, Pacific
  Islander, Maori, Jewish, Italian, German, French, Scandinavian, Polish, Russian, and Greek. The owner can reorder,
  replace, or add to it before it is built.
- "Use only English" means names written in the English alphabet, so names that are usually written with accents or
  apostrophes are given in their common plain-letter spelling. No non-English script is used.
- The names are invented combinations of common given names and surnames. None is meant to point to a real person; the
  list was checked for well-known public figures, but a common name will always match some real people.
- The placeholder is chosen when the popup is displayed, in the visitor's browser. The same visitor sees a new name on
  each display, and two visitors may see the same name.
- Repeated names in a row are allowed.
- The old fixed example "Jordan Reyes" is retired. It is not in the list.
- The list lives in the site's own source, not in Markdown content or a database, and has no admin screen.

## Example Name List

The 100 names, for the owner's review. Changing this list needs no other change to the requirements above, as long as
it keeps to FR-001, FR-006, and FR-007.

1. Emily Carter
2. James Whitfield
3. Maria Gonzalez
4. Carlos Ramirez
5. Wei Zhang
6. Mei Chen
7. Hiroshi Tanaka
8. Yuki Nakamura
9. Minjun Park
10. Jiwoo Kim
11. Anh Nguyen
12. Linh Tran
13. Priya Sharma
14. Arjun Patel
15. Ananya Iyer
16. Rohan Gupta
17. Fatima Khan
18. Omar Hassan
19. Layla Rahman
20. Yusuf Ali
21. Ahmad Karimi
22. Leila Hosseini
23. Mehmet Yilmaz
24. Elif Demir
25. David Cohen
26. Rachel Levy
27. Giulia Rossi
28. Marco Bianchi
29. Piotr Kowalski
30. Anna Nowak
31. Ivan Petrov
32. Olga Ivanova
33. Nikos Papadopoulos
34. Eleni Georgiou
35. Sean Murphy
36. Aoife Kelly
37. Chinedu Okafor
38. Amara Eze
39. Kwame Mensah
40. Abena Owusu
41. Tadesse Bekele
42. Selam Haile
43. Angelica Bautista
44. Miguel Villanueva
45. Lucas Oliveira
46. Beatriz Souza
47. Lars Johansson
48. Ingrid Andersen
49. Henrik Nielsen
50. Sofia Lindqvist
51. Hans Schneider
52. Greta Fischer
53. Pierre Dubois
54. Camille Laurent
55. Jamal Washington
56. Tanisha Robinson
57. Darnell Jackson
58. Keisha Williams
59. Tyrone Brooks
60. Ebony Harris
61. Thomas Bennett
62. Olivia Hughes
63. Ethan Foster
64. Grace Sullivan
65. Samuel Thompson
66. Natalie Anderson
67. Daniel Morales
68. Valentina Herrera
69. Diego Castillo
70. Isabella Mendoza
71. Andres Navarro
72. Camila Rojas
73. Raj Malhotra
74. Sunita Reddy
75. Vikram Singh
76. Deepa Nair
77. Aisha Siddiqui
78. Imran Qureshi
79. Nadia Haddad
80. Karim Mansour
81. Zainab Abdullah
82. Tariq Farouk
83. Xiaoming Liu
84. Jing Huang
85. Kenji Watanabe
86. Haruka Sato
87. Seoyeon Choi
88. Donghyun Jung
89. Thanh Pham
90. Hoa Le
91. Siti Rahim
92. Budi Santoso
93. Somchai Chaiyasit
94. Malia Kealoha
95. Aroha Parata
96. Jelani Banda
97. Thabo Nkosi
98. Naledi Dlamini
99. Wanjiru Kamau
100. Juma Otieno
