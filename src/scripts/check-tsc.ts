import { exec } from "child_process";

exec("tsc --noEmit", (error, stdout, stderr) => {
  if (error) {
    console.error(`TypeScript errors:\n${stderr}`);
    process.exit(1);
  } else {
    console.log("No TypeScript errors found.");
    process.exit(0);
  }
});
