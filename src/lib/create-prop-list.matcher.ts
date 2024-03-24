class PropFilter {
  /** 返回列表中那些不包含*或!符号的属性名 */
  static exact(list: string[]) {
    // eslint-disable-next-line no-useless-escape
    return list.filter(m => m.match(/^[^\*\!]+$/))
  }

  /** 返回列表中以!开头的属性名的剩余部分，表示不匹配这些确切的属性名 */
  static notExact(list: string[]) {
    // eslint-disable-next-line no-useless-escape
    return list.filter(m => m.match(/^\![^\*].*$/)).map(m => m.slice(1))
  }

  /** 返回列表中用*包围的部分 */
  static contain(list: string[]) {
    // eslint-disable-next-line no-useless-escape
    return list.filter(m => m.match(/^\*.+\*$/)).map(m => m.slice(1, -1))
  }

  /** 返回列表中以!*开头和结尾的部分，表示目标属性名不应包含这部分 */
  static notContain(list: string[]) {
    // eslint-disable-next-line no-useless-escape
    return list.filter(m => m.match(/^\!\*.+\*$/)).map(m => m.slice(2, -2))
  }

  /** 返回列表中以*开头的属性名的剩余部分 */
  static endWith(list: string[]) {
    // eslint-disable-next-line no-useless-escape
    return list.filter(m => m.match(/^\*[^\*]+$/)).map(m => m.slice(1))
  }

  /** 返回列表中以!*开头的剩余部分 */
  static notEndWith(list: string[]) {
    // eslint-disable-next-line no-useless-escape
    return list.filter(m => m.match(/^\!\*[^\*]+$/)).map(m => m.slice(2))
  }

  /** 返回列表中以*结尾的属性名的开始部分 */
  static startWith(list: string[]) {
    // eslint-disable-next-line no-useless-escape
    return list.filter(m => m.match(/^[^\*\!]+\*$/)).map(m => m.slice(0, -1))
  }

  /** 返回列表中以!开头和以*结尾的中间部分 */
  static notStartWith(list: string[]) {
    // eslint-disable-next-line no-useless-escape
    return list.filter(m => m.match(/^\![^\*]+\*$/)).map(m => m.slice(1, -1))
  }
}

export const createPropListMatcher = (propList: string[]) => {
  // 检查是否仅有一个通配符 '*'，这意味着所有属性都匹配
  const matchAll = propList.includes('*') && propList.length === 1
  if (matchAll) {
    // 如果匹配所有属性，直接返回一个始终为 true 的函数
    return () => true
  }

  const lists = {
    exact: PropFilter.exact(propList),
    contain: PropFilter.contain(propList),
    startWith: PropFilter.startWith(propList),
    endWith: PropFilter.endWith(propList),

    notExact: PropFilter.notExact(propList),
    notContain: PropFilter.notContain(propList),
    notStartWith: PropFilter.notStartWith(propList),
    notEndWith: PropFilter.notEndWith(propList)
  }

  return (prop: string) => {
    const include =
      lists.exact.includes(prop) || // 检查是否精确匹配
      lists.contain.some(m => prop.includes(m)) || // 检查是否包含特定片段
      lists.startWith.some(m => prop.startsWith(m)) || // 检查是否以特定片段开头
      lists.endWith.some(m => prop.endsWith(m)) // 检查是否以特定片段结尾

    const exclude =
      lists.notExact.includes(prop) ||
      lists.notContain.some(m => prop.includes(m)) ||
      lists.notStartWith.some(m => prop.startsWith(m)) ||
      lists.notEndWith.some(m => prop.endsWith(m))

    // prop 需满足 include 条件且不满足 exclude 条件
    return include && !exclude
  }
}

export default createPropListMatcher
