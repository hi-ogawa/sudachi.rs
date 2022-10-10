import { expect, test } from "@playwright/test";

test("basic", async ({ page }) => {
  await page.goto("/");

  // load dictionary file
  //   https://playwright.dev/docs/api/class-filechooser
  //   https://playwright.dev/docs/input#upload-files
  const [fileChooser] = await Promise.all([
    page.waitForEvent("filechooser"),
    page.locator("label[for=input-dictionary-file]").click(),
  ]);
  await fileChooser.setFiles(
    "../cli/data/sudachi-dictionary-20220729-small.zip"
  );

  // run tokenize
  await page
    .locator("data-test=textarea-sentence")
    .fill("検索は次の言語でもご利用いただけます");
  await page.locator("data-test=textarea-sentence").press("Control+Enter");

  // check output
  await expect(
    page.locator("data-test=output-line-break-segmentation")
  ).toHaveText(
    ["検索は", "次の", "言語でも", "ご利用", "いただけます"].join("\n")
  );
});
