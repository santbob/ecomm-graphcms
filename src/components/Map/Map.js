import { useEffect } from 'react';
import * as ReactLeafLet from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2X from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIconShadow from 'leaflet/dist/images/marker-shadow.png';
import styles from './Map.module.scss';
const { MapConsumer, MapContainer } = ReactLeafLet;


const Map = ({ className, children, ...rest }) => {
  let mapClassName = styles.map;
  if (className) {
    mapClassName += `${mapClassName} ${className}`;
  }

  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: markerIcon2X.src,
      iconUrl: markerIcon.src,
      shadowUrl: markerIconShadow.src,
    });

  }, [])

  return (
    <MapContainer className={mapClassName} {...rest}>
      <MapConsumer>
        {(map) => children(ReactLeafLet, map)}
      </MapConsumer>
    </MapContainer>

  )
}

export default Map;