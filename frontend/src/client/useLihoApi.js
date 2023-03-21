import { useState, useEffect, useCallback } from 'react'
import { useApi } from 'react-rest-api'

const useApiFetch = () => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    const [error,_] = useState();
    const api = useApi();
    const postForm = useCallback((url, config, queryParams) => {
        setLoading(true);
        api.post(url, config, queryParams).then((response) => {
            response.json().then((responseJson) => {
                console.log(responseJson)
                setData(responseJson);
                setLoading(false);
            })
        })
    }, [api])
    return {data, loading, error, sendRequest: postForm}
}

export default useApiFetch;
