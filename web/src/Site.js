export function Site({ _id, url, selector, value, newValue, onFetch, onUpdate, onChange, onDelete }) {
    return (
        <div className="site">
            <input type="text" value={url} className="form-control" onChange={(evt) => onChange({ _id, url: evt.target.value })} />
            <input type="text" value={selector} className="form-control" onChange={(evt) => onChange({ _id, selector: evt.target.value })} />
            <input type="text" value={value} className={newValue ? 'newValue form-control' : 'form-control'} onChange={(evt) => onChange({ _id, value: evt.target.value })} />
            <button onClick={() => onFetch({ _id, url, selector })} className="btn btn-primary">fetch</button>
            <button onClick={() => onUpdate({ _id, url, selector, value })} className="btn btn-success">update</button>
            <button onClick={() => onDelete({ _id })} className="btn btn-danger">delete</button>
        </div>
    );
}
