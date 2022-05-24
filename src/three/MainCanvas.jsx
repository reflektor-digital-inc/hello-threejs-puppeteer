import {useEffect, useLayoutEffect, useRef, useState} from "react";
import urlParams from "../utils/url-params";
import {Pane} from "tweakpane";
import queryString from "query-string";
import axios from "axios";
import {Canvas} from "@react-three/fiber";
import {OrbitControls, GradientTexture, PerspectiveCamera, Environment} from "@react-three/drei";
import {Selection} from "@react-three/postprocessing";
import {GENERATE_URL} from "../settings";
import Particles from "./Particles/Particles";
import SetupRenderMode from "./SetupRenderMode";
import {useTweaks} from "use-tweaks/src/useTweaks";
import Tunnel from "./Tunnel/Tunnel";
import Lights from "./Lights";
import Effects from "./Effects";

export default function MainCanvas() {

  const [frameloop] = useState(window.RENDER_MODE ? 'demand' : 'always');

  const [bgColor, bgColorSet] = useState(urlParams.get('bg') || '#ebb9b9');
  const bgColorRef = useRef(bgColor);
  useEffect(() => {
    console.log('bgColor', bgColor);
    bgColorRef.current = bgColor;
  }, [bgColor])

  useEffect(() => {
    console.info('window.RENDER_MODE:', window.RENDER_MODE);
    if (window.RENDER_MODE) {
      window._renderFrame(5);
    }
  }, []);

  useLayoutEffect(() => {
    console.log('MainCanvas useLayoutEffect');
  }, [])

  useEffect(() => {

    const PARAMS = {
      background: bgColor,
      status: 'Click Generate'
    };

    // const pane = new Pane();
    // pane.addInput(PARAMS, 'background').on('change', (ev) => {
    //   bgColorSet(ev.value);
    // });
    // const btn = pane.addButton({
    //   title: 'Generate'
    // }).on('click', () => {
    //   PARAMS.status = 'Generating ... Wait';
    //   btn.disabled = true;
    //
    //   const urlParamsVars = {
    //     bg: bgColorRef.current
    //   }
    //   const urlParamsString = queryString.stringify(urlParamsVars);
    //   console.info('urlParamsString:', urlParamsString);
    //   axios.get(`${GENERATE_URL}?${urlParamsString}`).then((response) => {
    //     console.info('response.data:', response.data);
    //     btn.disabled = false;
    //     PARAMS.status = 'Video Ready!';
    //     const dlButton = pane.addButton({
    //       title: 'Download Video'
    //     }).on('click', () => {
    //       window.open(response.data.video,'_blank');
    //     });
    //   })
    // });
    //
    // pane.addMonitor(PARAMS, 'status');

  }, []);

  const onClick = (e) => {
    if (window.RENDER_MODE){
      window._renderFrame(Math.round(Math.random()*2000));
    }
  }

  const {col1, col2} = useTweaks({
    col1: '#5739e5',
    col2: '#eb4b0b'
  })

  const {camPosX, camPosY, camPosZ} = useTweaks({
    camPosX: {value: 0, min: -50, max: 50},
    camPosY: {value: 0, min: -50, max: 50},
    camPosZ: {value: -30, min: -50, max: 10},
  })

  return (
    <Canvas
      id="main-canvas"
      frameloop={frameloop}
      gl={{ antialias: false, alpha: false }}
      onClick={onClick}
    >
      {/*<color attach="background" args={[bgColor]} />*/}
      <GradientTexture attach="background" stops={[0, 1]} colors={[col1, col2]} size={100} />
      <PerspectiveCamera
        makeDefault
        position={[camPosX, camPosY, camPosZ]}
        near={1}
        far={2000}
        />
      <OrbitControls />
      {/*<Particles />*/}
      <Selection>
        <Lights />
        <Tunnel />
        <Effects />
      </Selection>
      <Environment background={false} preset={'studio'} />
      <SetupRenderMode />
    </Canvas>
  )
}
