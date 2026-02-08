import { useEffect } from "react";
import {
  DEFAULT_CAMERA_FOV,
  DEFAULT_CAMERA_LOOK_AT,
  DEFAULT_CAMERA_POSITION,
} from "../../constants/constants";
import useAppStore from "../../stores/useAppStore";
import type { Page } from "../../types/types";
import * as UTILS from "../../utils/utils";

const PAGE_NAME: Page = "home";

export default function HomeThree() {
  useEffect(() => {
    const unsubCurrentPage = useAppStore.subscribe(
      (state) => state.currentPage,
      (value, previousValue) => {
        if (value === PAGE_NAME && previousValue !== PAGE_NAME) {
          UTILS.requestCameraUpdate({
            position: DEFAULT_CAMERA_POSITION,
            lookAt: DEFAULT_CAMERA_LOOK_AT,
            fov: DEFAULT_CAMERA_FOV,
          });
        }
      },
    );
    return () => {
      unsubCurrentPage();
    };
  }, []);

  useEffect(() => {
    if (useAppStore.getState().currentPage === PAGE_NAME) {
      UTILS.requestCameraUpdate({
        position: DEFAULT_CAMERA_POSITION,
        lookAt: DEFAULT_CAMERA_LOOK_AT,
        fov: DEFAULT_CAMERA_FOV,
      });
    }
  }, []);

  // useEffect(() => {
  //   const unsubEnterState = useAppStore.subscribe(
  //     (state) => state.enterState,
  //     (value, previousValue) => {
  //       if (
  //         value === "prepareToApproachMonitor" &&
  //         previousValue === "idleBoring"
  //       ) {
  //         // UTILS.requestCameraUpdate({
  //         //   position: new THREE.Vector3(0, 1.5, 4.5),
  //         //   lookAt: targetRefWorldPosition,
  //         //   fov: 65,
  //         //   positionSpringConfig: {
  //         //     duration: 1500,
  //         //     easing: easings.easeInCubic,
  //         //   },
  //         //   lookAtSpringConfig: {
  //         //     duration: 1500,
  //         //     easing: easings.easeInCubic,
  //         //   },
  //         //   fovSpringConfig: { duration: 1500, easing: easings.easeInCubic },
  //         // });
  //       } else if (
  //         value === "rearBackAndExpandFov" &&
  //         previousValue === "waitForCameraToReachPosition"
  //       ) {
  //         // UTILS.requestCameraUpdate({
  //         //   position: targetRefWorldPosition
  //         //     .clone()
  //         //     .add(new THREE.Vector3(0, 1.0, 7.5)),
  //         //   fov: 75,
  //         //   positionSpringConfig: {
  //         //     mass: 1,
  //         //     tension: 150,
  //         //     friction: 16,
  //         //   },
  //         //   fovSpringConfig: {
  //         //     mass: 1.5,
  //         //     tension: 150,
  //         //     friction: 10,
  //         //   },
  //         // });
  //         // const timeoutId = setTimeout(() => {
  //         //   useAppStore.setState({
  //         //     enterState: "zoomTowardsMonitorTightenFov",
  //         //   });
  //         // }, 500);
  //         // return () => {
  //         //   clearTimeout(timeoutId);
  //         // };
  //       } else if (
  //         value === "zoomTowardsMonitorTightenFov" &&
  //         previousValue === "rearBackAndExpandFov"
  //       ) {
  //         // UTILS.requestCameraUpdate({
  //         //   position: targetRefWorldPosition
  //         //     .clone()
  //         //     .add(new THREE.Vector3(0, 0, 0.1)),
  //         //   fov: 45,
  //         //   positionSpringConfig: {
  //         //     mass: 1,
  //         //     tension: 150,
  //         //     friction: 16,
  //         //     clamp: true,
  //         //   },
  //         //   fovSpringConfig: {
  //         //     mass: 1.5,
  //         //     tension: 150,
  //         //     friction: 10,
  //         //     clamp: true,
  //         //   },
  //         // });
  //       }
  //     },
  //   );
  //   return () => {
  //     unsubEnterState();
  //   };
  // }, []);

  return <></>;
}
