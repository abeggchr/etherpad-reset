# etherpad-reset

> Resets the contents of an etherpad pad

## Caution: Customized

This repo is customized for a specific pad. 

But it can easily be adapted for other pads by forking the repo
and modifying the files `template.html`, `playwright.yml` and `yopad.spec.ts`.

## Tech Stack

- TypeScript to generate the new content
- Playwright to upload the updated content
- GitHub actions for scheduling