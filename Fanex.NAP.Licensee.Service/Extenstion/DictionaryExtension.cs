using System.Collections.Generic;

namespace Fanex.NAP.Licensee.Service.Extenstion
{
    public static class DictionaryExtension
    {
        public static TValue GetValueOrDefault<Tkey, TValue>(this IDictionary<Tkey, TValue> dic, Tkey tKey, TValue defaultValue)
            => dic.ContainsKey(tKey) ? dic[tKey] : defaultValue;
    }
}
