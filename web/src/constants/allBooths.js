// web/src/constants/allBooths.js

import ictBoothData from "./ictBoothData";
import energyBoothData from "./energyBoothData";
import mobilityBoothData from "./mobilityBoothData";
import bioHealthBoothData from "./bioHealthBoothData";
// 추가 부스 데이터가 있다면 여기에 import

/**
 * 모든 부스 데이터를 하나로 통합
 */
const allBooths = [
  ...ictBoothData,
  ...energyBoothData,
  ...mobilityBoothData,
  ...bioHealthBoothData,
  // 추가 부스 데이터가 있다면 여기에 spread
];

export default allBooths;

/**
 * 카테고리별로 부스 찾기
 * @param {string} category - 카테고리 이름
 * @returns {Array} - 해당 카테고리의 부스 배열
 */
export function getBoothsByCategory(category) {
  return allBooths.filter((booth) => booth.category === category);
}

/**
 * 서브카테고리별로 부스 찾기
 * @param {string} subCategory - 서브카테고리 이름
 * @returns {Array} - 해당 서브카테고리의 부스 배열
 */
export function getBoothsBySubCategory(subCategory) {
  return allBooths.filter((booth) => booth.subCategory === subCategory);
}

/**
 * 부스 이름으로 검색
 * @param {string} name - 부스 이름 (일부만 입력해도 됨)
 * @returns {Object|null} - 찾은 부스 또는 null
 */
export function findBoothByName(name) {
  return allBooths.find((booth) => 
    booth.name.toLowerCase().includes(name.toLowerCase())
  );
}
