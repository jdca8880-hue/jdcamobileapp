import { ESLint } from "eslint";

async function run() {
  const eslint = new ESLint({
    overrideConfig: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true }
      },
      plugins: ["react-hooks"],
      rules: {
        "react-hooks/rules-of-hooks": "error"
      }
    }
  });

  const results = await eslint.lintFiles(["src/**/*.jsx", "src/**/*.js"]);
  const formatter = await eslint.loadFormatter("stylish");
  const resultText = formatter.format(results);
  
  if (resultText) {
    console.log(resultText);
  } else {
    console.log("No violations found!");
  }
}

run().catch((error) => {
  console.error(error);
});
