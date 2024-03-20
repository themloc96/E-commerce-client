/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import Container from '../../../components/Container';
import '../../../styles/as-status/situation-detail.scss';
import storeStyles from '../../../styles/store/store.module.scss';
import { useWindowDimensions } from '../../../hooks';
import {
  getAsServiceDetail,
  getSurChargeList,
  updateStatus,
} from '../../../apis/asService.api';
import ReceptionInformation from '../EnterActionDetails/components/ReceptionInformation';
import CustomerInformation from '../EnterActionDetails/components/CustomerInformation';
import ItemInformation from '../EnterActionDetails/components/ItemInformation';
import AsReceiptDetails from '../EnterActionDetails/components/AsReceiptDetails';
import AsCost from '../EnterActionDetails/components/AsCost';
import Attachment from '../EnterActionDetails/components/Attachment';
import EstimatedMaterial from '../EnterActionDetails/components/EstimatedMaterial';
import { afterServiceStatus } from '../../../constants';
import ActionHistory from '../EnterActionDetails/components/ActionHistory';

function AsReception() {
  const { width } = useWindowDimensions();
  const navigate = useNavigate();
  const { id } = useParams();
  const [isOpenMaterial, setIsOpenMaterial] = useState(width > 767);
  const [data, setData] = useState({
    customerInformation: {},
    receptionInformation: {},
    itemInformation: {},
    asReceiptDetail: {},
    asCost: {},
    estimatedMaterial: {},
    asFile: '',
    idDetail: null,
    asStatus: '',
  });

  const { isFetching, isSuccess, refetch } = useQuery({
    queryKey: [`/v1/after-service/{id}`],
    queryFn: () => {
      return getAsServiceDetail(id);
    },
    onSuccess: _data => {
      setData({
        customerInformation: {
          customerName: _data.customerName,
          customerPhoneNumber: _data.customerPhoneNumber,
          customerPhoneSecondNumber: _data.customerPhoneSecondNumber,
          customerAddress: _data.customerAddress,
          customerDetailedAddress: _data.customerDetailedAddress,
          customerNote: _data.customerNote,
        },
        receptionInformation: {
          receiptCode: _data.receiptCode,
          asEngineerName: _data.asEngineerName,
          createdAt: _data.createdAt,
        },
        itemInformation: {
          productModelName: _data.productModelName,
          productName: _data.productName,
          consultationType: _data.consultationType,
          consultationContent: _data.consultationContent,
          productId: _data.productId,
        },
        asReceiptDetail: {
          asReceiptType: _data.asReceiptType,
          asFeeType: _data.asFeeType,
          serialNumber: _data.serialNumber,
          installationDate: _data.installationDate,
          manufactureDate: _data.manufactureDate,
          representativeSymptom: _data.representativeSymptom,
          detailedSymptom: _data.detailedSymptom,
          asDispatchCategory: _data.asDispatchCategory,
        },
        asCost: {
          travelFee: _data.travelFee,
          materialFee: _data.materialFee,
          surchargeFee: _data.surchargeFee,
          surchargeList: _data.surchargeList,
          surchargeTotalFee: _data.surchargeTotalFee,
        },
        estimatedMaterial: {
          anticipationMaterialsList: _data.anticipationMaterialsList,
        },
        actionHistory: {
          asActionDetail: _data.asActionDetail,
          productModelName: _data.productModelName,
          productName: _data.productName,
          productId: _data.productId,
          representativeSymptom: _data.representativeSymptom,
          detailedSymptom: _data.detailedSymptom,
          consultationType: _data.consultationType,
        },
        asFile: _data.asFile,
        idDetail: _data.id,
        asStatus: _data.asStatus,
      });
    },
  });

  const { data: surchargeList } = useQuery(
    ['getSurChargeList'],
    () => getSurChargeList(),
    {
      onError: () => {},
    },
  );

  const { mutate } = useMutation(
    ['updateStatus'],
    () => updateStatus(data.idDetail, 'AAD'),
    {
      onError: () => {},
      onSuccess: () => {
        enqueueSnackbar('출동 승인되었습니다.', {
          variant: 'success',
        });
        navigate('/as/status');
      },
    },
  );

  const handleUpdateStatus = () => {
    mutate();
  };

  const convertAsStatus = status => {
    switch (status) {
      case afterServiceStatus.CC:
        return '상담완료';
      case afterServiceStatus.AC:
        return 'A/S 접수완료';
      case afterServiceStatus.AF:
        return 'A/S 조치완료';
      case afterServiceStatus.AAC:
        return 'A/S 조치확정';
      case afterServiceStatus.AM:
        return 'A/S 출동중';
      case afterServiceStatus.T:
        return '임시저장';
      case afterServiceStatus.C:
        return '취소';
      case afterServiceStatus.AAD:
        return '조치내역 입력필요';
      default:
        return '';
    }
  };

  function Style() {
    return (
      <style>
        {`
            .keyin-parent{ background-color: #FFFFFF;display: flex;flex-direction: column;overflow:hidden;}
            #product-order{background-color: #FFFFFF}
          `}
      </style>
    );
  }

  return (
    <>
      <Style />
      <div>
        <Container className={`${storeStyles.container} wrapper-situation`}>
          {width > 767 && (
            <div className="situation-heading-wrap">
              <button onClick={() => navigate(-1)}>
                <img src="/assets/icons/back.png" alt="back button" />
              </button>
              <h1 className="as-heading">접수 내역</h1>
            </div>
          )}
          <div className="content">
            <div className="tab-small case-four">
              <span>{convertAsStatus(data.asStatus)}</span>
            </div>

            <ReceptionInformation
              receptionInformation={data.receptionInformation}
            />
            <CustomerInformation customerData={data.customerInformation} />
            <ItemInformation itemInformation={data.itemInformation} />
            <AsReceiptDetails asReceiptDetail={data.asReceiptDetail} />
            <AsCost asCost={data?.asCost} surchargeList={surchargeList?.list} />
            <Attachment attachment={data.asFile ? data.asFile : []} />
            {data.asStatus === 'AAC' && (
              <ActionHistory actionHistory={data.actionHistory} />
            )}
            <EstimatedMaterial estimatedMaterial={data.estimatedMaterial} />

            {data.asStatus === 'AC' && (
              <div className="footer-situation">
                <div
                  className={`${width < 767 ? 'active' : ''} ${
                    !isOpenMaterial ? 'open' : ''
                  } submit-situation`}
                  onClick={handleUpdateStatus}
                >
                  <span>{width < 767 ? '출동승인' : '출동 승인'}</span>
                </div>
              </div>
            )}
          </div>
        </Container>
      </div>
    </>
  );
}

export default AsReception;
