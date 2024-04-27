// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-plugin-prettier/recommended";
import gitignore from "eslint-config-flat-gitignore";

export default tseslint.config(eslint.configs.recommended, ...tseslint.configs.recommended, prettier, gitignore());
