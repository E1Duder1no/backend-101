import esbuild from 'esbuild';

esbuild.build({
    allowOverwrite: true,
    bundle: true,
    entryPoints: ['./src/**/*.ts'],
    sourceRoot: 'src',
    format: 'esm',
    logLevel: 'info',
    minify: false,
    outdir: 'dist',
    packages: 'external',
    platform: 'node',
    splitting: true,
    target: 'esnext',
    treeShaking: true,
    write: true,
}).catch((error) => {
    console.error(error);
    process.exit(1);
});