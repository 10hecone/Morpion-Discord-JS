import * as fs from 'node:fs';

export async function handler(client) {
  for (const dir of fs.readdirSync('./src/client/components/')) {
    client[dir] = new Map();
    for (const cmdFile of fs.readdirSync(`./src/client/components/${dir}/`)) {
      if (!cmdFile.endsWith('js')) continue;

      const cmd = await import(`../../client/components/${dir}/` + cmdFile);

      if (['name', 'category'].some((key) => cmd.component[key] === undefined))
        return console.error(`Components: ${cmd.default.name} not loaded, missing field`);
      if (cmd.component.category !== dir)
        return console.error(`Components: dir/${cmd.default.name} not loaded, category not match`);

      client[dir].set(cmd.component.name, cmd.component);

      console.log(`Commande: ${cmd.component.name} loaded!`);
    }
  }
}
