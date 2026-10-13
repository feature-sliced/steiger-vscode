const esbuild = require("esbuild");

const production = process.argv.includes('--production');
const watch = process.argv.includes('--watch');

/**
 * @type {import('esbuild').Plugin}
 */
const esbuildProblemMatcherPlugin = {
  name: 'esbuild-problem-matcher',

  setup(build) {
    build.onEnd((result) => {
      result.errors.forEach(({ text, location }) => {
        console.error(`✘ [ERROR] ${text}`);
        console.error(`    ${location.file}:${location.line}:${location.column}:`);
      });
    });
  },
};

async function main() {
  const ctx = await esbuild.context({
    entryPoints: [
      'src/extension.ts',
      'src/langauge-server.ts',
    ],
    bundle: true,
    format: 'cjs',
    minify: production,
    sourcemap: false,
    sourcesContent: false,
    platform: 'node',
    outdir: 'dist',
    external: ['vscode'],
    define: {
      PRODUCTION: production ? 'true' : 'false',
    },
    logLevel: 'silent',
    plugins: [
      /* add to the end of plugins array */
      esbuildProblemMatcherPlugin,
    ],
  });
  if (watch) {
    await ctx.watch();
  } else {
    await ctx.rebuild();
    await ctx.dispose();
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
