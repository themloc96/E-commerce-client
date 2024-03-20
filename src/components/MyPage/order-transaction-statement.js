/* eslint-disable jsx-a11y/control-has-associated-label */
import { useState, useMemo, useEffect } from 'react';
import { formateDate, formatCost } from '../../utils/helpers';

const style = {
  height: '15.0pt',
  textAlign: 'center',
  padding: '3px',
  border: 'none',
};

function TransactionStatement(props) {
  const { billing } = props;
  const [isMileageUse, setIsMileageUse] = useState(false);
  const formatCostPrint = value => {
    const cost = formatCost(Math.floor(value));
    return cost.replace(/,/g, ',');
  };

  useEffect(() => {
    setIsMileageUse(billing.order.mileagePointUsage > 0);
  }, [billing]);

  const totalQuantity = useMemo(() => {
    return billing && billing.order && billing.order.orderDetails.length > 0
      ? billing.order.orderDetails.reduce(
          (prev, current) => prev + parseInt(current.quantity, 10),
          0,
        )
      : 0;
  }, [billing]);

  const sumPrice = useMemo(() => {
    const total =
      billing && billing.order && billing.order.orderDetails.length > 0
        ? billing.order.orderDetails?.reduce(
            (prev, current) =>
              prev +
              Math.round(
                (current.unitPrice ?? 0) +
                  (current.productOptions[0]?.price ?? 0),
              ) *
                current.quantity,
            0,
          )
        : 0;
    return total;
  }, [billing]);

  const sumPriceVAT = useMemo(() => {
    return billing && billing.order && billing.order.orderDetails.length > 0
      ? billing.order.orderDetails.reduce(
          (prev, current) =>
            prev +
            Math.round(
              ((current.unitPrice ?? 0) +
                (current.productOptions[0]?.price ?? 0)) *
                0.1,
            ) *
              current.quantity,
          0,
        )
      : 0;
  }, [billing]);

  return (
    <>
      <style>
        {`
          td {
            font-size: 12px;
            word-break: break-all;
          }
          @media print {
            td {
              font-size: 10px;
              word-break: break-all;
            }
          }
        `}
      </style>
      <table
        border="1"
        cellPadding={0}
        cellSpacing={0}
        width="100%"
        style={{ borderCollapse: 'collapse', tableLayout: 'fixed' }}
      >
        <tbody>
          <tr height={20} style={{ height: '15.0pt' }}>
            <th colSpan={11} height={20} className="xl118" style={style}>
              거래 명세 집계표
            </th>
          </tr>
        </tbody>
      </table>

      <table
        border="1"
        cellPadding={0}
        cellSpacing={0}
        width="100%"
        style={{ borderCollapse: 'collapse', tableLayout: 'fixed' }}
      >
        <colgroup>
          <col span="1" width={90} />
          <col span="1" />
          <col span="1" width={90} />
          <col span="1" />
          <col span="1" />
          <col span="1" width={50} />
          <col span="1" />
          <col span="1" />
          <col span="1" />
          <col span="1" />
          <col span="1" />
        </colgroup>
        <tbody>
          <tr height={20} style={{ height: '15.0pt' }}>
            <td
              colSpan={11}
              height={20}
              className="xl118"
              style={{
                borderRight: '1.0pt solid black important',
                borderTop: '1.0pt solid black',
                height: '15.0pt',
                textAlign: 'center',
                padding: '3px',
              }}
            >
              (공급받는자 용)
            </td>
          </tr>
          <tr
            height={44}
            style={{ msoHeightSource: 'userset', height: '33.0pt' }}
          >
            <td
              colSpan={2}
              height={44}
              className="xl123"
              style={{
                borderRight: '.5pt solid black',
                height: '33.0pt',
                textAlign: 'center',
                padding: '3px',
              }}
            >
              사업자등록번호
            </td>
            <td
              colSpan={4}
              className="xl125"
              style={{
                borderRight: '.5pt solid black',
                borderLeft: 'none',
                textAlign: 'center',
                padding: '3px',
              }}
            >
              348-87-01843
            </td>
            <td
              rowSpan={6}
              className="xl128"
              style={{
                borderBottom: '.5pt solid black',
                borderTop: 'none',
                textAlign: 'center',
                padding: '3px',
              }}
            >
              <span style={{ display: 'block' }}>공</span>
              <span style={{ display: 'block' }}>급</span>
              <span style={{ display: 'block' }}>받</span>
              <span style={{ display: 'block' }}>는</span>
              <span style={{ display: 'block' }}>자</span>
            </td>
            <td
              colSpan={2}
              className="xl131"
              style={{
                borderRight: '.5pt solid black',
                borderLeft: 'none',
                textAlign: 'center',
                padding: '3px',
              }}
            >
              사업자등록번호
            </td>
            <td
              colSpan={2}
              className="xl125"
              style={{
                borderRight: '1.0pt solid black',
                borderLeft: 'none',
                textAlign: 'center',
                padding: '3px',
              }}
            >
              {/* 138-81-92314 */}
              {billing?.buyerBusiness?.businessRegistrationNumber || ''}
            </td>
          </tr>
          <tr
            height={44}
            style={{
              msoHeightSource: 'userset',
              height: '33.0pt',
              textAlign: 'center',
            }}
          >
            <td
              rowSpan={4}
              height={144}
              width={150}
              className="xl138"
              style={{
                borderBottom: '.5pt solid black',
                height: '109.5pt',
                borderTop: 'none',
                minWidth: 200,
                textAlign: 'center',
                padding: '3px',
              }}
            >
              <span style={{ display: 'block' }}>공</span>
              <span style={{ display: 'block' }}>급</span>
              <span style={{ display: 'block' }}>자</span>
            </td>
            <td
              className="xl92"
              style={{
                borderLeft: 'none',
                textAlign: 'center',
                padding: '3px',
              }}
            >
              상
              <span
                style={{
                  msoSpacerun: 'yes',
                  textAlign: 'center',
                  padding: '3px',
                }}
              >
                &nbsp;
              </span>
              호
            </td>
            <td
              colSpan={4}
              className="xl141"
              style={{
                borderRight: '.5pt solid black',
                borderLeft: 'none',
                textAlign: 'center',
                padding: '3px',
              }}
            >
              주식회사 라오나크
            </td>
            <td
              className="xl92"
              style={{
                borderLeft: 'none',
                textAlign: 'center',
                padding: '3px',
              }}
            >
              상<span style={{ msoSpacerun: 'yes' }}>&nbsp;</span>호
            </td>
            <td className="xl93" style={{ borderLeft: 'none' }}>
              {/* 21세기열쇠 */}
              {billing?.buyerBusiness?.businessName || ''}
            </td>
            <td className="xl92" style={{ borderLeft: 'none' }}>
              대표자
            </td>
            <td
              className="xl94"
              style={{ borderTop: 'none', borderLeft: 'none' }}
            >
              {/* 신승철 */}
              {billing?.buyerBusiness?.businessRepresentativeName || ''}
            </td>
          </tr>
          <tr
            height={28}
            style={{ msoHeightSource: 'userset', height: '21.75pt' }}
          >
            <td
              rowSpan={2}
              height={56}
              className="xl142"
              style={{
                borderBottom: '.5pt solid black',
                height: '43.5pt',
                borderTop: 'none',
                textAlign: 'center',
                padding: '3px',
              }}
            >
              주<span style={{ msoSpacerun: 'yes' }}>&nbsp; </span>소
            </td>
            <td
              colSpan={4}
              rowSpan={2}
              className="xl144"
              width={363}
              style={{
                borderRight: '.5pt solid black',
                borderBottom: '.5pt solid black',
                width: '273pt',
                textAlign: 'center',
                padding: '3px',
              }}
            >
              서울특별시 금천구 디지털로 121, 19층 1911호
            </td>
            <td
              rowSpan={2}
              className="xl142"
              style={{
                borderBottom: '.5pt solid black',
                borderTop: 'none',
                textAlign: 'center',
                padding: '3px',
              }}
            >
              주<span style={{ msoSpacerun: 'yes' }}>&nbsp; </span>소
            </td>
            <td
              colSpan={3}
              rowSpan={2}
              className="xl144"
              width={344}
              style={{
                borderRight: '1.0pt solid black',
                borderBottom: '.5pt solid black',
                width: '258pt',
                textAlign: 'center',
                padding: '3px',
              }}
            >
              {/* 경기도 안양시 동안구 관악대로 370 */}
              {billing?.buyerBusiness?.businessAddress || ''}
            </td>
          </tr>
          <tr
            height={28}
            style={{ msoHeightSource: 'userset', height: '21.75pt' }}
          />
          <tr
            height={44}
            style={{ msoHeightSource: 'userset', height: '33.0pt' }}
          >
            <td
              height={44}
              className="xl92"
              style={{
                height: '33.0pt',
                borderLeft: 'none',
                textAlign: 'center',
                padding: '3px',
              }}
            >
              성<span style={{ msoSpacerun: 'yes' }}>&nbsp; </span>명
            </td>
            <td
              colSpan={4}
              className="xl141"
              style={{
                borderRight: '.5pt solid black',
                borderLeft: 'none',
                textAlign: 'center',
                padding: '3px',
              }}
            >
              구민기
            </td>
            <td
              className="xl92"
              style={{
                borderLeft: 'none',
                textAlign: 'center',
                padding: '3px',
              }}
            >
              현장명
            </td>
            <td
              colSpan={3}
              className="xl141"
              style={{
                borderRight: '1.0pt solid black',
                borderLeft: 'none',
                textAlign: 'center',
                padding: '3px',
              }}
            >
              &nbsp;
            </td>
          </tr>
          <tr
            height={44}
            style={{
              msoHeightSource: 'userset',
              height: '33.0pt',
              textAlign: 'center',
              padding: '3px',
            }}
          >
            <td
              colSpan={2}
              height={44}
              className="xl123"
              style={{
                borderRight: '.5pt solid black',
                height: '33.0pt',
                padding: '3px',
              }}
            >
              작 성 일
            </td>
            <td
              colSpan={4}
              className="xl136"
              style={{
                borderRight: '.5pt solid black',
                borderLeft: 'none',
                padding: '3px',
              }}
            >
              {formateDate(new Date())}
            </td>
            <td className="xl92" style={{ borderLeft: 'none', padding: '3px' }}>
              합<span style={{ msoSpacerun: 'yes' }}>&nbsp;</span>계
            </td>
            <td
              colSpan={3}
              className="xl133"
              style={{
                borderRight: '1.0pt solid black',
                borderLeft: 'none',
                padding: '3px',
              }}
            >
              {/* ₩2.767.600 &lt;VAT 포함&gt; */}₩
              {formatCostPrint(
                sumPrice + sumPriceVAT - billing.order.mileagePointUsage,
              )}{' '}
              &lt;VAT 포함&gt;
            </td>
          </tr>
          <tr
            height={20}
            style={{ height: '15.0pt', textAlign: 'center', padding: '3px' }}
          >
            <td
              height={20}
              className="xl95"
              style={{ height: '15.0pt', padding: '3px' }}
            >
              &nbsp;
            </td>
            <td style={{ padding: '3px' }} className="xl96" />
            <td style={{ padding: '3px' }} className="xl96" />
            <td style={{ padding: '3px' }} className="xl96" />
            <td style={{ padding: '3px' }} className="xl97" />
            <td style={{ padding: '3px' }} className="xl96" />
            <td style={{ padding: '3px' }} className="xl96" />
            <td style={{ padding: '3px' }} className="xl96" />
            <td style={{ padding: '3px' }} className="xl96" />
            <td style={{ padding: '3px' }} className="xl96" />
            <td style={{ padding: '3px' }} className="xl98">
              &nbsp;
            </td>
          </tr>
          {/* header */}
          <tr
            height={48}
            style={{
              msoHeightSource: 'userset',
              height: '36.75pt',
              textAlign: 'center',
              padding: '3px',
            }}
          >
            <td
              height={48}
              className="xl99"
              style={{ height: '36.75pt', width: '150px', padding: '3px' }}
            >
              일<span style={{ msoSpacerun: 'yes' }}>&nbsp; </span>자
            </td>
            <td
              colSpan={2}
              className="xl121"
              style={{
                borderRight: '.5pt solid black',
                borderLeft: 'none',
                padding: '3px',
              }}
            >
              품명
            </td>
            <td className="xl73" style={{ borderLeft: 'none', padding: '3px' }}>
              규격
            </td>
            <td className="xl73" style={{ borderLeft: 'none', padding: '3px' }}>
              단위
            </td>
            <td className="xl73" style={{ borderLeft: 'none', padding: '3px' }}>
              수량
            </td>
            <td
              colSpan={2}
              className="xl121"
              style={{
                borderRight: '.5pt solid black',
                borderLeft: 'none',
                padding: '3px',
              }}
            >
              단<span style={{ msoSpacerun: 'yes' }}>&nbsp; </span>가(￦)
            </td>
            <td className="xl73" style={{ borderLeft: 'none', padding: '3px' }}>
              공급가액(￦)
            </td>
            <td className="xl73" style={{ borderLeft: 'none', padding: '3px' }}>
              VAT(￦)
            </td>
            <td
              className="xl100"
              style={{ borderLeft: 'none', padding: '3px' }}
            >
              비고
            </td>
          </tr>
          {/* end header */}
          {billing?.order?.orderDetails.map((dt, index) => {
            console.log('dt : ', dt.createdAt);
            const unitPrice = Math.round(
              (dt?.unitPrice ?? 0) + (dt?.productOptions[0]?.price ?? 0),
            );
            return (
              <tr
                key={dt?.product?.id}
                height={20}
                style={{
                  height: '15.0pt',
                  textAlign: 'center',
                  padding: '3px',
                }}
              >
                <td
                  height={20}
                  className="xl101"
                  style={{
                    height: '15.0pt',
                    borderTop: 'none',
                    padding: '3px',
                  }}
                >
                  {/* 2022.03.02 */}
                  {dt?.createdAt && index === 0
                    ? formateDate(dt?.createdAt)
                    : ''}
                </td>
                <td
                  colSpan={2}
                  className="xl114"
                  style={{ borderRight: '.5pt solid black', padding: '3px' }}
                >
                  {dt?.product?.name || ''}
                </td>
                <td
                  className="xl86"
                  style={{ borderLeft: 'none', padding: '3px' }}
                >
                  &nbsp;
                </td>
                <td
                  className="xl88"
                  style={{ borderLeft: 'none', padding: '3px' }}
                >
                  {dt?.productUnitName}
                </td>
                <td
                  className="xl84"
                  style={{ borderLeft: 'none', padding: '3px' }}
                >
                  <span style={{ msoSpacerun: 'yes' }}>&nbsp;</span>
                  {dt?.quantity}
                </td>
                <td
                  colSpan={2}
                  className="xl112"
                  style={{
                    borderRight: '.5pt solid black',
                    borderLeft: 'none',
                    padding: '3px',
                  }}
                >
                  {/* <span style={{ msoSpacerun: 'yes' }}>&nbsp;</span>68.000{' '} */}
                  <span style={{ msoSpacerun: 'yes' }}>&nbsp;</span>
                  {/* {dt?.unitPrice ? formatCostPrint(dt?.unitPrice) : 0}{' '} */}
                  {formatCostPrint(unitPrice)}
                </td>
                <td
                  className="xl84"
                  style={{ borderLeft: 'none', padding: '3px' }}
                >
                  {/* <span style={{ msoSpacerun: 'yes' }}>&nbsp;</span>748.000{' '} */}
                  <span style={{ msoSpacerun: 'yes' }}>&nbsp;</span>
                  {formatCostPrint(unitPrice * dt.quantity)}
                </td>
                <td
                  className="xl84"
                  style={{ borderLeft: 'none', padding: '3px' }}
                >
                  {formatCostPrint(unitPrice * dt.quantity * 0.1)}
                </td>
                <td
                  className="xl110"
                  style={{
                    borderTop: 'none',
                    borderLeft: 'none',
                    padding: '3px',
                  }}
                >
                  {dt?.note || ''}
                </td>
              </tr>
            );
          })}
          {isMileageUse && (
            <tr
              height={20}
              style={{
                height: '15.0pt',
                textAlign: 'center',
                padding: '3px',
              }}
            >
              <td
                height={20}
                className="xl101"
                style={{
                  height: '15.0pt',
                  borderTop: 'none',
                  padding: '3px',
                }}
              >
                {/* 2022.03.02 */}
              </td>
              <td
                colSpan={2}
                className="xl114"
                style={{
                  borderRight: '.5pt solid black',
                  padding: '3px',
                  color: 'red',
                }}
              >
                마일리지 사용량
              </td>
              <td
                className="xl86"
                style={{ borderLeft: 'none', padding: '3px' }}
              >
                &nbsp;
              </td>
              <td
                className="xl88"
                style={{ borderLeft: 'none', padding: '3px' }}
              />
              <td
                className="xl84"
                style={{ borderLeft: 'none', padding: '3px' }}
              >
                <span style={{ msoSpacerun: 'yes' }}>&nbsp;</span>
              </td>
              <td
                colSpan={2}
                className="xl112"
                style={{
                  borderRight: '.5pt solid black',
                  borderLeft: 'none',
                  padding: '3px',
                }}
              >
                {/* <span style={{ msoSpacerun: 'yes' }}>&nbsp;</span>68.000{' '} */}
                <span style={{ msoSpacerun: 'yes' }}>&nbsp;</span>
                {/* {dt?.unitPrice ? formatCostPrint(dt?.unitPrice) : 0}{' '} */}
              </td>
              <td
                className="xl84"
                style={{ borderLeft: 'none', padding: '3px', color: 'red' }}
              >
                {/* <span style={{ msoSpacerun: 'yes' }}>&nbsp;</span>748.000{' '} */}
                <span style={{ msoSpacerun: 'yes' }}>
                  -{formatCost(billing.order.mileagePointUsage)}
                </span>
              </td>
              <td
                className="xl84"
                style={{ borderLeft: 'none', padding: '3px' }}
              />
              <td
                className="xl110"
                style={{
                  borderTop: 'none',
                  borderLeft: 'none',
                  padding: '3px',
                }}
              />
            </tr>
          )}
          <tr height={20} style={{ height: '15.0pt' }}>
            <td
              colSpan={11}
              height={62}
              className="xl168"
              style={{
                borderRight: '1.0pt solid black',
                borderBottom: '.5pt solid black',
                height: '48.0pt',
                textAlign: 'center',
                padding: '3px',
              }}
            >
              <strong>입금 계좌 : 기업은행 588-035198-04-016라오나크</strong>
            </td>
          </tr>
          <tr height={20} style={{ height: '15.0pt' }}>
            <td
              colSpan={6}
              rowSpan={3}
              height={60}
              className="xl177"
              style={{
                borderRight: '.5pt solid black',
                padding: '3px',
                borderBottom: '.5pt solid black',
                height: '45.0pt',
              }}
            >
              &nbsp;
            </td>
            <td
              colSpan={2}
              rowSpan={3}
              className="xl186"
              style={{
                borderRight: '.5pt solid black',
                padding: '3px',
                borderBottom: '.5pt solid black',
              }}
            >
              인 수 자
            </td>
            <td
              colSpan={3}
              rowSpan={3}
              className="xl159"
              style={{
                borderRight: '1.0pt solid black',
                padding: '3px',
                borderBottom: '.5pt solid black',
              }}
            >
              &nbsp;
            </td>
          </tr>
          <tr height={20} style={{ height: '15.0pt' }} />
          <tr height={20} style={{ height: '15.0pt' }} />
          <tr height={20} style={{ height: '15.0pt' }}>
            <td
              height={20}
              className="xl105"
              style={{ height: '15.0pt', borderTop: 'none', padding: '3px' }}
            >
              &nbsp;
            </td>
            <td
              colSpan={2}
              className="xl121"
              style={{
                borderRight: '.5pt solid black',
                borderLeft: 'none',
                padding: '3px',
              }}
            >
              실 청구합계
            </td>
            <td className="xl73" style={{ borderLeft: 'none', padding: '3px' }}>
              &nbsp;
            </td>
            <td className="xl73" style={{ borderLeft: 'none', padding: '3px' }}>
              &nbsp;
            </td>
            <td className="xl83" style={{ borderLeft: 'none', padding: '3px' }}>
              <span style={{ msoSpacerun: 'yes' }}>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{' '}
              </span>
              {/* 37{' '} */}
              {totalQuantity || 0}{' '}
            </td>
            <td
              colSpan={2}
              className="xl158"
              style={{ borderRight: '.5pt solid black' }}
            >
              &nbsp;
            </td>
            <td className="xl73" style={{ borderLeft: 'none', padding: '3px' }}>
              &nbsp;
            </td>
            <td className="xl73" style={{ borderLeft: 'none', padding: '3px' }}>
              &nbsp;
            </td>
            <td
              className="xl100"
              style={{ borderTop: 'none', borderLeft: 'none', padding: '3px' }}
            >
              &nbsp;
            </td>
          </tr>
          <tr
            height={47}
            style={{ msoHeightSource: 'userset', height: '35.25pt' }}
          >
            <td
              colSpan={2}
              height={47}
              className="xl192"
              style={{ height: '35.25pt' }}
            >
              공급가액(￦)
            </td>
            <td
              className="xl106"
              style={{ borderLeft: 'none', padding: '3px' }}
            >
              {/* 2.516.000 */}
              {sumPrice ? formatCostPrint(sumPrice) : 0}
            </td>
            <td
              className="xl106"
              style={{ borderLeft: 'none', padding: '3px' }}
            >
              VAT(￦)
            </td>
            <td
              className="xl106"
              style={{ borderLeft: 'none', padding: '3px' }}
            >
              {/* 251.600 */}
              {sumPriceVAT ? formatCostPrint(sumPriceVAT) : 0}
            </td>
            <td
              className="xl107"
              style={{ borderTop: 'none', borderLeft: 'none', padding: '3px' }}
            >
              &nbsp;
            </td>
            <td className="xl108" style={{ borderTop: 'none', padding: '3px' }}>
              &nbsp;
            </td>
            <td className="xl109" style={{ borderTop: 'none', padding: '3px' }}>
              &nbsp;
            </td>
            <td
              className="xl106"
              style={{ borderLeft: 'none', padding: '3px' }}
            >
              합 계(￦)
            </td>
            <td
              colSpan={2}
              className="xl156"
              align="right"
              style={{
                borderRight: '1.0pt solid black',
                borderLeft: 'none',
                padding: '3px',
              }}
            >
              {/* 2.767.600 */}
              {formatCostPrint(
                sumPrice + sumPriceVAT - billing.order.mileagePointUsage,
              )}
            </td>
          </tr>
          {/* [if supportMisalignedColumns] */}
          {/* [endif] */}
        </tbody>
      </table>
    </>
  );
}

export default TransactionStatement;
