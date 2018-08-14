const RIGHT_TURN = -1; // clockwise
const LEFT_TURN = 1; // counter clockwise
const COLLINEAR = 0;

class Point {
    constructor(x, y) {
        this.x = parseInt(x);
        this.y = parseInt(y);
    }

    toString() {
        return "(" + this.x.toString() + "," + this.y.toString() + ")";
    }

    equals(other) {
        return this.getX() === other.getX() && this.getY() === other.getY();
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    static sorter(ptA, ptB) {
        return ptA.getX() - ptB.getX() || ptA.getY() - ptB.getY();
    }
}

function getXs(points) {
    let xs = [];
    for (let i = 0; i < points.length; ++i) {
        xs.push(points[i].getX());
    }
    return xs;
}

function getYs(points) {
    let ys = [];
    for (let i = 0; i < points.length; ++i) {
        ys.push(points[i].getY());
    }
    return ys;
}

function strToPts(s) {
    // remove parens
    let no_parens = s.replace(/\(|\)/g, '');
    // separate out the numbers
    let nums = no_parens.split(',');

    // collect points
    let points = [];
    for (let i = 0; i < nums.length; i+=2) {
        points.push(new Point(nums[i], nums[i+1]));
    }

    return points;
}

function pointsToStr(points) {
    let pt_strs = [];
    for (let i = 0; i < points.length-1; ++i) {
        pt_strs.push(points[i].toString());
    }
    // separate each point with a comma
    return pt_strs.join(",")
}

function getOrientation(ptP, ptQ, ptR) {
    let val = (ptQ.getY() - ptP.getY()) * (ptR.getX() - ptQ.getX()) - (ptQ.getX() - ptP.getX()) * (ptR.getY() - ptQ.getY());
    if (val === 0) { return COLLINEAR; } // collinear orientation found
    if (val > 0) { return RIGHT_TURN; } // clockwise orientation found
    return LEFT_TURN; // counter clockwise orientation found
}

function keepLeft(points, ptP) {
    while (points.length > 1 && getOrientation(points[points.length-2], points[points.length-1], ptP) !== LEFT_TURN) {
        points.pop();
    }
    if (!points.length || !ptP.equals(points[points.length-1])) {
        points.push(ptP);
    }
    return points;
}

function getLowerHull(sortedUniquePtsArr) {
    let lowerHull = [];
    for (let i = 0; i < sortedUniquePtsArr.length; ++i) {
        lowerHull = keepLeft(lowerHull, sortedUniquePtsArr[i]);
    }
    return lowerHull;
}

function getUpperHull(sortedUniquePtsArr) {
    let upperHull = [];
    for (let i = sortedUniquePtsArr.length - 1; i >= 0; --i) {
        upperHull = keepLeft(upperHull, sortedUniquePtsArr[i]);
    }
    return upperHull;
}

function mergeHulls(lowerHull, upperHull) {
    // remove duplicate since they start/end on the same point
    return [].concat(lowerHull).concat(upperHull.slice(1));
}

function getUniquePts(points) {
    // handle undefined input
    if (!points) { return points; }

    // get unique points
    let uniquePtsMap = new Map();
    for (let i = 0; i < points.length; ++i) {
        uniquePtsMap[points[i].toString()] = points[i];
    }
    return Object.values(uniquePtsMap);
}

function grahamScan(points) {
    const uniquePtsArr = getUniquePts(points);
    // no need to calculate if 3 or less unique points
    if (!uniquePtsArr || uniquePtsArr.length <= 3) {
        return uniquePtsArr;
    }
    // sort and calculate the lower/upper hulls
    let sortedUniquePtsArr = uniquePtsArr.sort(Point.sorter);
    let lowerHull = getLowerHull(sortedUniquePtsArr);
    let upperHull = getUpperHull(sortedUniquePtsArr);
    return mergeHulls(lowerHull, upperHull);
}

function getLeftMostPointIndex(points) {
    let minIndex = 0;
    for (let i = 1; i < points.length; ++i) {
        let minPt = points[minIndex];
        let otherPt = points[i];
        if (otherPt.getX() < minPt.getX()) {
            minIndex = i;
        } else if (otherPt.getX() === minPt.getX() && otherPt.getY() < minPt.getY()) {
            minIndex = i;
        }
    }
    return minIndex;
}

function jarvisMarch(points) {
    const uniquePtsArr = getUniquePts(points);
    // no need to calculate if 3 or less unique points
    if (!uniquePtsArr || uniquePtsArr.length <= 3) {
        return uniquePtsArr;
    }
    let hull = [];
    let leftMostPointIndex = getLeftMostPointIndex(uniquePtsArr);
    let q = 0;
    let p = leftMostPointIndex;

    do {
        hull.push(uniquePtsArr[p]);
        q = (p + 1) % uniquePtsArr.length;

        for (let i = 0; i < uniquePtsArr.length; ++i) {
            const orientation = getOrientation(uniquePtsArr[p], uniquePtsArr[q], uniquePtsArr[i]);
            if (orientation === LEFT_TURN) {
                q = i;
            }
        }

        p = q;
    } while (p !== leftMostPointIndex);

    hull.push(hull[0]);
    return hull;
}

module.exports = {
    getXs,
    getYs,
    strToPts,
    pointsToStr,
    grahamScan,
    jarvisMarch
};