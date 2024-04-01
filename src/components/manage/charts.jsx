import "/src/stylesheets/manage/charts.less"
import RobotDistribution from "../chart/robotDistribution.jsx";
import BannedCount from "../chart/bannedCount.jsx";
import VisitorVolume from "../chart/visitorVolume.jsx";

export default function Charts() {


    return <div className="charts">
        <RobotDistribution/>
        <VisitorVolume/>
        <BannedCount/>
    </div>
}
