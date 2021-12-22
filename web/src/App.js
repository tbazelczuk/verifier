
import { useCallback, useEffect, useState } from 'react'
import { Site } from './Site'

function App() {
  const [sites, setSites] = useState([])
  const [selector, setSelector] = useState('')
  const [value, setValue] = useState('')
  const [url, setUrl] = useState('')

  const loadSites = useCallback(() => {
    fetch('/api/sites')
      .then((res) => res.json())
      .then((data) => {
        setSites(data)
      })
  }, [])

  const onAdd = () => {
    fetch('/api/sites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url, selector })
    })
      .then(() => {
        setSelector('')
        setValue('')
        setUrl('')
        loadSites()
      })
      .catch(console.error)
  }

  const onDelete = useCallback((_id) => {
    if (window.confirm("Delete?")) {
      fetch('/api/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ _id })
      })
        .then(() => {
          loadSites()
        })
        .catch(console.error);
    }
  }, [loadSites]);

  const onFetchNew = () => {
    fetch('/api/fetch', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url, selector })
    })
      .then((res) => res.json())
      .then(({ value }) => {
        setValue(value)
      })
  }


  const onFetch = useCallback(({ _id, url, selector }) => {
    fetch('/api/fetch', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url, selector })
    })
      .then((res) => res.json())
      .then(({ value }) => {
        setSites((sites) => sites.map((site) => site._id === _id ? { ...site, value, newValue: true } : site))
      })
      .catch(console.error);
  }, []);

  const onChange = useCallback(({ _id, ...args }) => {
    setSites((sites) => sites.map((site) => site._id === _id ? { ...site, ...args } : site))
  }, []);

  const onUpdate = useCallback(({ _id, url, selector, value }) => {
    fetch('/api/sites', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ _id, url, selector, value })
    })
      .then(() => loadSites())
      .catch(console.error);
  }, [loadSites]);

  useEffect(() => loadSites(), [loadSites])

  return (
    <div className="sites">
      {sites.map((site) =>
        <Site key={site._id} {...site} onFetch={onFetch} onChange={onChange} onUpdate={onUpdate} onDelete={onDelete} />
      )}
      <div className='newSite'>
        <input type="text" value={url} className="form-control" placeholder='url' onChange={(evt) => setUrl(evt.target.value)} />
        <input type="text" value={selector} className="form-control" placeholder='selector' onChange={(evt) => setSelector(evt.target.value)} />
        <span>{value}</span>
        <button onClick={onFetchNew} className="btn btn-primary">fetch</button>
        <button onClick={onAdd} className="btn btn-success">add</button>
      </div>
    </div>
  );
}

export default App;
