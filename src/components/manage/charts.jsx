import "/src/stylesheets/manage/charts.less"
import RobotDistribution from "../chart/robotDistribution.jsx";
import Banned from "../chart/banned.jsx";
import VisitorVolume from "../chart/visitorVolume.jsx";

export default function Charts() {


    return <div className="charts">
        <VisitorVolume/>
        <RobotDistribution/>
        {/*<Banned/>*/}
    </div>
}
