import AMapLoader from '@amap/amap-jsapi-loader';
import { useCallback, useRef } from 'react';
import { AMAP_KEY, AMAP_PLUGINS, AMAP_SECURITY_CODE } from '../lib/amap/config';

let setMapErrorExternally = null;

export const useAmapLoader = (errorSetter) => {
  const amapRef = useRef(null);
  const amapLoadPromiseRef = useRef(null);

  if (errorSetter && !setMapErrorExternally) {
    setMapErrorExternally = errorSetter;
  }

  const loadAmap = useCallback(async () => {
    if (!AMAP_KEY || !AMAP_SECURITY_CODE) {
      if (setMapErrorExternally) setMapErrorExternally(true);
      throw new Error('高德地图配置缺失，请在 .env 文件中配置 VITE_AMAP_KEY 和 VITE_AMAP_SECURITY_CODE');
    }

    if (amapRef.current) return amapRef.current;
    if (amapLoadPromiseRef.current) return amapLoadPromiseRef.current;

    window._AMapSecurityConfig = {
      securityJsCode: AMAP_SECURITY_CODE
    };

    amapLoadPromiseRef.current = AMapLoader.load({
      key: AMAP_KEY,
      version: '2.0',
      plugins: AMAP_PLUGINS
    }).then((AMap) => {
      amapRef.current = AMap;
      return AMap;
    });

    return amapLoadPromiseRef.current;
  }, []);

  return { loadAmap, amapRef };
};