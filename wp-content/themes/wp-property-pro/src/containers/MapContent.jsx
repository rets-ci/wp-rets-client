import { connect } from 'react-redux'
import Map from '../components/Map.jsx'

const mapStateToProps = (state) => {
    return {
        mapState: state.mapState,
        response: state.apiState.response || {}
    }
};

const MapContent = connect(
    mapStateToProps
)(Map);

export default MapContent