// TODO: remove after https://github.com/feature-sliced/steiger/issues/287 is fixed
declare module '@feature-sliced/language-server' {
  const server: { listen(): void };
  export default server;
}
