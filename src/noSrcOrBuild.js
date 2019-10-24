const get = require('lodash/get');
const getPackages = require('get-monorepo-packages');

const { resolve } = require('path');

module.exports = {
  create(context) {
    const { options, report } = context;
    const root = resolve(get(options, [0, 'root'], process.cwd()));
    const onlyFrom = get(options, [0, 'onlyFrom'], []).map(path =>
      resolve(path)
    );
    const packages = getPackages(root)
      .filter(
        ({ location }) =>
          !onlyFrom.length || onlyFrom.some(path => location.startsWith(path))
      )
      .map(({ package: { name } }) => name);

    return {
      ImportDeclaration(node) {
        const {
          source: { range, value }
        } = node;

        const isInScope = packages.some(packageName =>
          value.startsWith(packageName)
        );

        const exp = /\/(src|build)/i;

        if (!isInScope || !exp.test(value)) return;

        report({
          node,
          message: `Using 'src' or 'build' in '${value}' import path`,
          fix: fixer =>
            fixer.replaceTextRange(range, `'${value.replace(exp, '')}'`)
        });
      }
    };
  }
};
