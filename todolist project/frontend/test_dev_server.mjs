import { createServer } from 'vite';

async function test() {
  const server = await createServer({
    server: { port: 5173 }
  });
  await server.listen();
  const address = server.httpServer.address();
  console.log(`Vite dev server listening on port: ${address.port}`);
  
  const response = await fetch(`http://localhost:${address.port}`);
  console.log(`HTTP Status: ${response.status}`);
  const html = await response.text();
  console.log(`Contains #root: ${html.includes('id="root"')}`);

  // Test loading the main module through vite dev server (Vite compiles JSX on the fly)
  const mainModuleRes = await fetch(`http://localhost:${address.port}/src/main.jsx`);
  console.log(`main.jsx transform status: ${mainModuleRes.status}`);

  // Test loading App.jsx through vite dev server
  const appModuleRes = await fetch(`http://localhost:${address.port}/src/App.jsx`);
  console.log(`App.jsx transform status: ${appModuleRes.status}`);

  // Test loading Sidebar.jsx through vite dev server
  const sidebarRes = await fetch(`http://localhost:${address.port}/src/components/Sidebar.jsx`);
  console.log(`Sidebar.jsx transform status: ${sidebarRes.status}`);

  await server.close();
  console.log('Vite dev server verified and closed successfully.');
}

test().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
