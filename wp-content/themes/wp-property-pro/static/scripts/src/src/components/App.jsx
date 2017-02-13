import React from 'react';
import Menu from './Menu.jsx';
import Content from './Content.jsx';
import Search from './Search.jsx'
import Map from './Map.jsx'

const App = () => (
    <div>
        <Menu />
        <Search />
        <Map />
        <Content />
    </div>
);

export default App;