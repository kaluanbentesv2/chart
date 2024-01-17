"use client";

import clsx from "clsx";
import { useLayoutEffect, useRef, useState } from "react";
import { random } from "lodash";

import styles from "./RankingChart.module.scss";
import { mockData } from "./mockData";

interface DatasetItem {
  semester: string;
  ranking: string | null;
  average: string | null;
}

interface Semester {
  name: string;
  isUpdating: boolean;
  isNotEligible: boolean;
}

interface RankingChartProps {
  semesters?: Semester[];
  rankings?: string[];
  dataset?: DatasetItem[];
}

interface GetRangkinAverageProps {
  dataset: DatasetItem[];
  semester: string;
  ranking: string;
}

interface Point {
  semester: string;
  x: number;
  y: number;
}

const MIN_RANKING_LENGTH = 4;

const getRankingAverage = ({
  dataset,
  semester,
  ranking,
}: GetRangkinAverageProps) => {
  const value = dataset.find((item) => {
    return item.ranking === ranking && semester === item.semester;
  });

  return value?.average || null;
};

const generateMoreCells = (rankings: string[]) => {
  return Array.from(
    new Set(
      rankings
        .map((ranking, index) => {
          const nextValue = rankings[index + 1];

          if (nextValue) {
            const random1 = random(Number(ranking), Number(nextValue));
            const randomizedNumbers = [Number(ranking), random1];

            randomizedNumbers.sort((a, b) => a - b);

            return randomizedNumbers;
          }

          return [Number(ranking)];
        })
        .filter((item) => item)
        .flat()
    )
  );
};

export default function RankingChart({
  semesters = mockData.semesters,
  rankings = mockData.rankings,
  dataset = mockData.dataset,
}: RankingChartProps) {
  const tableRef = useRef<null | HTMLTableElement>(null);
  const [svgDimensions, setSvgDimensions] = useState([0, 0]);
  const [points, setPoints] = useState<(Point | null)[]>([]);
  const [legendMargin, setLegendMargin] = useState<number | undefined>(0);
  const generatedRankings =
    rankings.length > MIN_RANKING_LENGTH
      ? rankings
      : generateMoreCells(rankings);

  semesters.sort((a, b) => Number(a.name) - Number(b.name));

  const getLegendMargins = () => {
    const table = document.getElementById("rankingChart") as HTMLTableElement;
    const th = table?.querySelector("tbody th");

    setLegendMargin(th?.clientWidth);
  };

  useLayoutEffect(() => {
    const getCellsCoords = () => {
      const table = document.getElementById("rankingChart") as HTMLTableElement;
      const tableCoords = table?.getBoundingClientRect();
      const cells = table?.querySelectorAll("td");
      const pointsPayload: Point[] = [];

      cells?.forEach((cell) => {
        if (Boolean(cell.innerText)) {
          const coords = cell.getBoundingClientRect();
          const point = {
            semester: cell.getAttribute("data-semester")!,
            x: coords.left - tableCoords.left + cell.clientWidth / 2,
            y: coords.top - tableCoords.top + cell.clientHeight / 2,
          };
          pointsPayload.push(point);
        }
      });

      pointsPayload.sort((a, b) => a.x - b.x);

      const semesterPoints = semesters.map((semester) => {
        const datasetValue = dataset.find(
          (item) => item.semester === semester.name
        );

        if (datasetValue?.average) {
          return pointsPayload.find(
            (point) => point.semester === semester.name
          );
        }

        return null;
      });

      setPoints(semesterPoints as (Point | null)[]);
    };

    const getSvgDimensions = () => {
      if (tableRef.current) {
        const tableElement = tableRef.current as HTMLTableElement;
        setSvgDimensions([tableElement.clientWidth, tableElement.clientHeight]);
      }
    };

    const initialize = () => {
      getSvgDimensions();
      getCellsCoords();
      getLegendMargins();
    };

    initialize();

    window.addEventListener("resize", initialize);

    return () => {
      window.removeEventListener("resize", initialize);
    };
  }, [dataset, semesters]);

  return (
    <div className={styles.container}>
      <table id="rankingChart" className={styles.table} ref={tableRef}>
        <thead>
          <tr>
            <th></th>
            {semesters.map((semester) => (
              <th key={semester.name}>{semester.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {generatedRankings.map((ranking) => (
            <tr key={ranking}>
              <th>{ranking}</th>
              {semesters.map((semester) => {
                const average = getRankingAverage({
                  dataset,
                  semester: semester.name,
                  ranking: String(ranking),
                });

                return (
                  <td
                    key={semester.name}
                    className={clsx(
                      semester.isNotEligible && styles.isNotEligible,
                      semester.isUpdating && styles.isUpdating
                    )}
                    data-semester={semester.name}
                  >
                    {average ? (
                      <span className={styles.average}>{average}</span>
                    ) : null}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {svgDimensions[0] && (
        <svg
          className={styles.svg}
          width={svgDimensions[0]}
          height={svgDimensions[1]}
        >
          {points.length &&
            points.map(
              (point, index) =>
                point && (
                  <line
                    key={index}
                    x1={point.x}
                    y1={point.y}
                    x2={points[index + 1] ? points[index + 1]?.x : point.x}
                    y2={points[index + 1] ? points[index + 1]?.y : point.y}
                    stroke="black"
                    strokeWidth="2"
                  />
                )
            )}
          {points.length &&
            points.map(
              (point, index) =>
                point && (
                  <circle
                    key={index}
                    cx={point.x}
                    cy={point.y}
                    r="6"
                    fill="black"
                  />
                )
            )}
        </svg>
      )}
      <p className={styles.legend} style={{ marginLeft: legendMargin }}>
        - Semestre não elegível ao ranking{" "}
        <span className={styles.isNotEligibleLegendBox} />
      </p>
      <p className={styles.legend} style={{ marginLeft: legendMargin }}>
        - Ranking em atualização <span className={styles.isUpdatingLegendBox} />
      </p>
    </div>
  );
}
