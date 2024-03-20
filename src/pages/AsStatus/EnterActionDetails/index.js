/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import Container from '../../../components/Container';
import '../../../styles/as-status/situation-detail.scss';
import storeStyles from '../../../styles/store/store.module.scss';
import { useWindowDimensions } from '../../../hooks';
import {
  getAsServiceDetail,
  getSurChargeList,
  updateStatus,
} from '../../../apis/asService.api';
import CustomerInformation from './components/CustomerInformation';
import ReceptionInformation from './components/ReceptionInformation';
import ItemInformation from './components/ItemInformation';
import AsReceiptDetails from './components/AsReceiptDetails';
import AsCost from './components/AsCost';
import Attachment from './components/Attachment';
import EstimatedMaterial from './components/EstimatedMaterial';
import { afterServiceStatus } from '../../../constants';

function EnterActionDetails() {
  const { width } = useWindowDimensions();
  const navigate = useNavigate();
  const { id } = useParams();
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
        asFile: _data.asFile,
        idDetail: _data.id,
        asStatus: _data.asStatus,
      });
    },
  });

  const [isOpenMaterial, setIsOpenMaterial] = useState(width > 767);

  const { data: surchargeList } = useQuery(
    ['getSurChargeList'],
    () => getSurChargeList(),
    {
      onError: () => {},
      onSuccess: () => {},
    },
  );

  // const { mutate } = useMutation(
  //   ['updateStatus'],
  //   () => updateStatus([data.idDetail], afterServiceStatus.AF),
  //   {
  //     onError: () => {},
  //     onSuccess: () => {
  //
  //     },
  //   },
  // );

  const handleUpdateStatus = () => {
    // mutate();
    navigate(`/as/action-result/case-one/${data.idDetail}`);
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
            <div className="wrapper-tab">
              <div className="tab-small">
                <span>조치내역 입력</span>
              </div>
            </div>
            <ReceptionInformation
              receptionInformation={data.receptionInformation}
            />
            <CustomerInformation customerData={data.customerInformation} />
            <ItemInformation itemInformation={data.itemInformation} />
            <AsReceiptDetails asReceiptDetail={data.asReceiptDetail} />
            <AsCost asCost={data?.asCost} surchargeList={surchargeList?.list} />
            <Attachment attachment={data.asFile ? data.asFile : []} />
            <EstimatedMaterial estimatedMaterial={data.estimatedMaterial} />
            <div className="footer-situation">
              <div
                className={`${width < 767 ? 'active' : ''} ${
                  !isOpenMaterial ? 'open' : ''
                } submit-situation`}
                onClick={handleUpdateStatus}
              >
                <span>조치내역 입력</span>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}

export default EnterActionDetails;
