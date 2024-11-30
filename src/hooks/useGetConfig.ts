import { useEffect, useState } from 'react'
import { Config } from '../types'

const defaultConfig: Config = {
  gridColumns: [],
  detailColumns: [],
}

export const useGetConfig = () => {
  const [config, setConfig] = useState<Config>(defaultConfig)

  useEffect(() => {
    fetch('/config.json')
      .then((response) => response.json())
      .then((result) => {
        if (result) setConfig(result)
      })
  }, [])
  return config
}
