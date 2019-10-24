const get = require('lodash/get');
const isNumber = require('lodash/isNumber');
const findUp = require('find-up');

const { dirname, relative, resolve } = require('path');

const isValidMaxUp = (maxUp, path) =>
  maxUp !== Infinity &&
  isNumber(maxUp) &&
  maxUp > 0 &&
  new RegExp(`(..\\/){${maxUp + 1},}`, 'g').test(path);

const removeIndex = path => `'${path.replace(/(.*)\/index$/i, '$1')}'`;

module.exports = {
  create(context) {
    return {
      ImportDeclaration(node) {
        const {
          source: { value, range }
        } = node;
        const file = context.getFilename();

        const { options } = context;
        const maxUp = get(options, [0, 'maxUp'], Infinity);

        const packageJson = findUp.sync('package.json', {
          cwd: dirname(file)
        });

        // eslint-disable-next-line global-require,import/no-dynamic-require
        const { name: workspaceName } = require(packageJson);

        const workspaceRoot = dirname(packageJson);

        const startsWithDots = new RegExp('^..\\/', 'i').test(value);

        if (startsWithDots && isValidMaxUp(maxUp, value)) {
          const workspaceImportPath = resolve(dirname(file), value).replace(
            `${workspaceRoot}/src`,
            workspaceName
          );

          context.report({
            node,
            message: `Using more than allowed '${maxUp}' deepness.`,
            fix: fixer =>
              fixer.replaceTextRange(range, removeIndex(workspaceImportPath))
          });

          return;
        }

        const isInScope = new RegExp(`^${workspaceName}`, 'i').test(value);

        if (!isInScope) return;

        const absoluteImportPath = value.replace(
          workspaceName,
          `${workspaceRoot}/src`
        );

        const relativePath = relative(dirname(file), absoluteImportPath);

        if (isValidMaxUp(maxUp, relativePath)) {
          return;
        }

        context.report({
          node,
          message: `Using absolute '${workspaceName}' self-workspace path in import`,
          fix: fixer =>
            fixer.replaceTextRange(range, removeIndex(`./${relativePath}`))
        });
      }
    };
  }
};
