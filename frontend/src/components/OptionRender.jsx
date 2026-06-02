function OptionRender({name, value, selectedValue, onChange}) {
    return (
        <input 
            name={name} 
            type="radio" 
            value={value}
            checked={selectedValue === value}
            onChange={onChange}
        />
    );
}

export default OptionRender;