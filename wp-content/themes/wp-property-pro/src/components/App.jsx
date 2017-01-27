import React from 'react';
import Menu from './Menu.jsx';
import Content from './Content.jsx';
import MapContent from '../containers/MapContent.jsx'

const App = () => (
    <div>
        <Menu />
        <MapContent />
        <Content />
    </div>
);

export default App;