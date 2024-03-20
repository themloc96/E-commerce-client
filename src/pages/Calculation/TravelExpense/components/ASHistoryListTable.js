import React, { useMemo } from 'react';
import useWindowDimensions from '../../../../hooks/useWindowDimensions';
import { formatNumber } from '../../../../utils/helpers';
import { formatShortDate } from '../../../../utils/helper.dateTime';

function ASHistoryListTable({ dataList }) {
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;

  const {
    travelFee: travelFeeSum,
    surchargeTotalFee: surchargeTotalFeeSum,
    nightSurchargeFee: nightSurchargeFeeSum,
    distanceSurchargeFee: distanceSurchargeFeeSum,
    holidaySurchargeFee: holidaySurchargeFeeSum,
    othersSurchargeFee: othersSurchargeFeeSum,
    surchargeFee: surchargeFeeSum,
    totalFee: totalFeeSum,
    totalVatFee: totalVatFeeSum,
  } = useMemo(() => {
    // 기본 출장비
    const travelFee = dataList?.reduce((prev, current) => {
      return prev + current.travelFee;
    }, 0);

    // 할증료
    const surchargeTotalFee = dataList?.reduce((prev, current) => {
      return prev + current.surchargeTotalFee;
    }, 0);

    // 야간 할증료
    const nightSurchargeFee = dataList?.reduce((prev, current) => {
      return prev + current.nightSurchargeFee;
    }, 0);

    // 거리 할증료
    const distanceSurchargeFee = dataList?.reduce((prev, current) => {
      return prev + current.distanceSurchargeFee;
    }, 0);

    // 휴일 할증료
    const holidaySurchargeFee = dataList?.reduce((prev, current) => {
      return prev + current.holidaySurchargeFee;
    }, 0);

    // 기타 할증료
    const othersSurchargeFee = dataList?.reduce((prev, current) => {
      return prev + current.othersSurchargeFee;
    }, 0);

    // 추가요금
    const surchargeFee = dataList?.reduce((prev, current) => {
      return prev + current.surchargeFee;
    }, 0);

    // 총계
    const totalFee = dataList?.reduce((prev, current) => {
      return prev + (current.surchargeTotalFee + current.travelFee);
    }, 0);

    // 총계 부가세
    const totalVatFee = dataList?.reduce((prev, current) => {
      return (
        prev + Math.round((current.travelFee + current.surchargeTotalFee) * 0.1)
      );
    }, 0);

    return {
      travelFee,
      surchargeTotalFee,
      nightSurchargeFee,
      distanceSurchargeFee,
      holidaySurchargeFee,
      othersSurchargeFee,
      surchargeFee,
      totalFee,
      totalVatFee,
    };
  }, [dataList]);
  const isCustomStyleNotData = isDesktop && !dataList.length

  return (
    <div className="AS-history-list-table-wrap">
      <table>
        <tr>
          <th style={{ width: isCustomStyleNotData ? '5%' : 'auto' }}>No</th>
          <th>요청일</th>
          <th>확정일</th>
          <th>구분</th>
          <th>
            {isDesktop ? (
              '(기본)출장비'
            ) : (
              <>
                <p>출장비</p>
                <p className="text-[8px] text-[#333] leading-tight">(기본)</p>
              </>
            )}
          </th>
          <th>
            {isDesktop ? (
              '할증료(계)'
            ) : (
              <>
                <p>할증료</p>
                <p className="text-[8px] text-[#333] leading-tight">(계)</p>
              </>
            )}
          </th>
          <th>야간</th>
          <th>거리</th>
          <th>휴일</th>
          <th>기타</th>
          <th>추가요금</th>
          <th>총계(출장비+할증료)</th>
          <th
            style={{
              width: isCustomStyleNotData ? '1%' : 'auto',
              paddingRight: isCustomStyleNotData ? '31px' : '0',
              paddingLeft: isCustomStyleNotData ? '34px' : '0',
            }}
          >
            VAT
          </th>
        </tr>

        {dataList?.map((raw, index) => {
          const {
            updatedAt,
            confirmDate,
            asFeeType,
            travelFee,
            surchargeTotalFee,
            nightSurchargeFee,
            distanceSurchargeFee,
            holidaySurchargeFee,
            othersSurchargeFee,
            surchargeFee,
          } = raw;
          return (
            <tr>
              <td>{index + 1}</td>
              <td>{formatShortDate(updatedAt)}</td>
              <td>{formatShortDate(confirmDate)}</td>
              <td>{asFeeType === 'FREE' ? '무상' : '유상'}</td>
              <td>{formatNumber(travelFee)}</td>
              <td>{formatNumber(surchargeTotalFee)}</td>
              <td>{formatNumber(nightSurchargeFee)}</td>
              <td>{formatNumber(distanceSurchargeFee)}</td>
              <td>{formatNumber(holidaySurchargeFee)}</td>
              <td>{formatNumber(othersSurchargeFee)}</td>
              <td>{formatNumber(surchargeFee)}</td>
              <td>{formatNumber(travelFee + surchargeTotalFee)}</td>
              <td>
                {formatNumber(
                  Math.round((travelFee + surchargeTotalFee) * 0.1),
                )}
              </td>
            </tr>
          );
        })}

        {isDesktop ? (
          <tr className="lower-order PC">
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>{formatNumber(travelFeeSum)}</td>
            <td>{formatNumber(surchargeTotalFeeSum)}</td>
            <td>{formatNumber(nightSurchargeFeeSum)}</td>
            <td>{formatNumber(distanceSurchargeFeeSum)}</td>
            <td>{formatNumber(holidaySurchargeFeeSum)}</td>
            <td>{formatNumber(othersSurchargeFeeSum)}</td>
            <td>{formatNumber(surchargeFeeSum)}</td>
            <td>{formatNumber(totalFeeSum)}</td>
            <td
              style={{
                width: isCustomStyleNotData ? '1%' : 'auto',
                // paddingRight: isCustomStyleNotData ? '31px' : '0',
                // paddingLeft: isCustomStyleNotData ? '31px' : '0',
              }}
            >
              {formatNumber(totalVatFeeSum)}
            </td>
          </tr>
        ) : (
          <tr className="lower-order MO">
            <td colSpan="4">소계</td>
            <td>{formatNumber(travelFeeSum)}</td>
            <td>{formatNumber(surchargeTotalFeeSum)}</td>
            <td>{formatNumber(nightSurchargeFeeSum)}</td>
            <td>{formatNumber(distanceSurchargeFeeSum)}</td>
            <td>{formatNumber(holidaySurchargeFeeSum)}</td>
            <td>{formatNumber(othersSurchargeFeeSum)}</td>
            <td>{formatNumber(surchargeFeeSum)}</td>
            <td>{formatNumber(totalFeeSum)}</td>
            <td>{formatNumber(totalVatFeeSum)}</td>
          </tr>
        )}
      </table>
    </div>
  );
}

export default ASHistoryListTable;
