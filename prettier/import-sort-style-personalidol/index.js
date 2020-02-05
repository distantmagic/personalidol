function isLocalClass(imported) {
  return imported.moduleName.startsWith("src/framework/classes");
}

function isLocalDecorator(imported) {
  return imported.moduleName.startsWith("src/framework/decorators");
}

function isLocalEnum(imported) {
  return imported.moduleName.startsWith("src/framework/enums");
}

function isLocalHelper(imported) {
  return imported.moduleName.startsWith("src/framework/helpers");
}

function isLocalInterface(imported) {
  return imported.moduleName.startsWith("src/framework/interfaces");
}

function isLocalModule(imported) {
  return imported.moduleName.startsWith("src/");
}

function isLocalType(imported) {
  return imported.moduleName.startsWith("src/framework/types");
}

function format(styleApi) {
  const {
    and,
    hasNamespaceMember,
    hasOnlyDefaultMember,
    member,
    naturally,
    not,
    or,
  } = styleApi;

  return [
    {
      match: and(
        hasNamespaceMember,
        not(isLocalModule)
      ),
      sort: member(naturally),
    },
    {
      match: and(
        hasOnlyDefaultMember,
        not(isLocalModule)
      ),
      sort: member(naturally),
    },
    {
      match: not(isLocalModule),
      sort: member(naturally),
    },
    { separator: true },

    // import foo from "src/framework/helpers/foo"
    {
      match: and(
        hasOnlyDefaultMember,
        isLocalHelper,
      ),
      sort: member(naturally),
    },
    {
      match: isLocalHelper,
      sort: member(naturally),
    },
    { separator: true },

    // import Foo from "src/framework/classes/Foo"
    {
      match: and(
        hasOnlyDefaultMember,
        isLocalClass,
      ),
      sort: member(naturally),
    },
    {
      match: isLocalClass,
      sort: member(naturally),
    },
    { separator: true },

    // import useFoo from "src/enums/useFoo"
    {
      match: isLocalEnum,
      sort: member(naturally),
    },
    { separator: true },

    // import useFoo from "src/decorators/useFoo"
    {
      match: isLocalDecorator,
      sort: member(naturally),
    },
    { separator: true },

    // import Foo from "src/framework/interfaces/Foo"
    {
      match: and(
        hasOnlyDefaultMember,
        isLocalInterface,
      ),
      sort: member(naturally),
    },
    {
      match: isLocalInterface,
      sort: member(naturally),
    },
    { separator: true },

    // import Foo from "src/framework/types/Foo"
    {
      match: and(
        hasOnlyDefaultMember,
        isLocalType,
      ),
      sort: member(naturally),
    },
    {
      match: isLocalType,
      sort: member(naturally),
    },
    { separator: true },
  ];
}

module.exports = format;
