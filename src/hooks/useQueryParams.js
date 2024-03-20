import { useSearchParams } from 'react-router-dom'

export const useQueryString = () => {
  const [searchParams] = useSearchParams()
  const searchParamsObject = Object.fromEntries([...searchParams])
  return searchParamsObject
}

export const useQueryParams = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const filterParamsObj = Object.fromEntries([...searchParams])

  const mergeParams = (newFilterParams) => {
    const result = {}
    const keys1 = Object.keys(newFilterParams)
    const keys2 = Object.keys(filterParamsObj)

    keys1.forEach(key => {
      if (keys2.includes(key) && filterParamsObj[key] !== '' && filterParamsObj[key] !== undefined) {
        result[key] = filterParamsObj[key]
      } else if (newFilterParams[key] !== '' && newFilterParams[key] !== undefined) {
        result[key] = newFilterParams[key]
      }
    })

    keys2.forEach(key => {
      if (!keys1.includes(key) && filterParamsObj[key] !== '' && filterParamsObj[key] !== undefined) {
        result[key] = filterParamsObj[key]
      }
    })

    return result
  }

  return {
    searchParams,
    filterParamsObj,
    mergeParams,
    setSearchParams
  }
}
