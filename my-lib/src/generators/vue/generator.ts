import {
  addDependenciesToPackageJson,
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  GeneratorCallback,
  runTasksInSerial,
  Tree,
} from '@nx/devkit';
import * as path from 'path';
import { VueGeneratorSchema } from './schema';

const DEPENDENCY = {
  dependencies: {
    vue: '^3.2.47',
  },
  devDependencies: {
    '@vitejs/plugin-vue': '^4.1.0',
    typescript: '^5.0.2',
    vite: '^4.3.9',
    'vue-tsc': '^1.4.2',
  },
};

export async function vueGenerator(tree: Tree, options: VueGeneratorSchema) {
  const projectRoot = `libs/${options.name}`;
  addProjectConfiguration(tree, options.name, {
    root: projectRoot,
    projectType: 'application',
    sourceRoot: `${projectRoot}/src`,
    targets: {
      dev: {
        // inputs: [
        //   {
        //     externalDependencies: ['vite'],
        //   },
        // ],
        // command: `cd ${projectRoot} && vite`,
        executor: '@nx/vite:dev-server',
        defaultConfiguration: 'development',
        options: {
          buildTarget: `${options.name}:build`,
        },
        dependsOn: ['^build'],
      },
      build: {
        // inputs: [
        //   {
        //     externalDependencies: ['vite', 'vue-tsc'],
        //   },
        // ],
        // command: `cd ${projectRoot} && vue-tsc && vite build`,
        executor: '@nx/vite:build',
        // outputs: [`{${options.outputPath}}`],
        defaultConfiguration: 'production',
        options: {
          outputPath: `dist/libs/${options.name}`,
          skipTypeCheck: true,
        },
        configurations: {
          development: {
            mode: 'development',
          },
          production: {
            mode: 'production',
          },
        },
        dependsOn: ['^build'],
      },
      preview: {
        inputs: [
          {
            externalDependencies: ['vite'],
          },
        ],
        // command: `cd ${projectRoot} && vite preview`,
      },
    },
  });
  generateFiles(tree, path.join(__dirname, 'files'), projectRoot, options);
  await formatFiles(tree);
  const tasks: GeneratorCallback[] = [];
  const installTask = await addDependenciesToPackageJson(
    tree,
    DEPENDENCY.dependencies,
    DEPENDENCY.devDependencies
  );
  tasks.push(installTask);

  return runTasksInSerial(...tasks);
}

export default vueGenerator;
