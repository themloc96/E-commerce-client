import { useMutation, useQuery } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
// COMPs
import Container from '../../../components/Container';
import FullScreenLoader from '../../../components/Loading/FullScreenLoader';
import ConfirmationModal from '../../../components/Shared/ConfirmationModal';
import PortalWrapper from '../../../components/Shared/PortalWrapper';
import NoData from '../../../components/WTable/NoData';
import FormContent from './components/FormContent';
import MaterialMobile from './components/MaterialMobile';
import MaterialModal from './components/MaterialModal';
import MaterialSection from './components/MaterialSection';

import {
  getAfterServiceByIdFn,
  updateAfterServiceFn,
} from '../../../apis/after-service';
import { getMemberByIdFn } from '../../../apis/members.api';
import useTogglePortal from '../../../components/Shared/PortalWrapper/useTogglePortal';
import { useAuthContext } from '../../../contexts/AuthProvider';
import { useCheckedItems, useToggleModal } from '../../../hooks';
import '../../../styles/as-status/action-result.scss';
import storeStyles from '../../../styles/store/store.module.scss';
import { isEmptyObject } from '../../../utils/helpers';

const ELEMENT_ID = 'after-service-complete';
function ActionResultCaseOne() {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
    trigger,
    control,
  } = useForm();
  const { id } = useParams();
  const {
    state: {
      businessInfo: { id: businessId },
    },
  } = useAuthContext();
  const { isOpen: isOpenMaterial, onToggle: onToggleMaterial } =
    useToggleModal();
  const { isOpen: isOpenConfirmation, onToggle: onToggleConfirmation } =
    useToggleModal();
  const { isPortalOpen, togglePortal } = useTogglePortal(ELEMENT_ID);
  const {
    items: productMaterials,
    handleChangeItems,
    handleChangeChecked,
    handleChangeAllChecked,
  } = useCheckedItems();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // query: After sevice data
  const {
    data: afterService,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: [`v1/after-service/${id}`, id],
    queryFn: () => {
      return getAfterServiceByIdFn(id);
    },
  });
  const { data: memberName } = useQuery(
    [afterService?.memberId],
    () =>
      getMemberByIdFn({
        id: afterService?.memberId,
      }),
    {
      select: data => {
        return data?.name;
      },
      enabled: !!afterService?.memberId,
    },
  );

  // after service mutation
  const { mutate: updateAterService } = useMutation(
    body => updateAfterServiceFn(body),
    {
      onSuccess: () => {
        refetch();
        onToggleConfirmation();
        enqueueSnackbar('조치하신 정보가 정상적으로 등록되었습니다.', {
          variant: 'success',
        });
        navigate('/as/status');
      },
    },
  );

  useEffect(() => {
    reset({
      ...afterService,
      memberName,
    });
    const newProductMaterials = afterService?.anticipationMaterialsList?.map(
      item => {
        return {
          id: item?.asMaterialsId,
          code: item?.asMaterialCode,
          name: item?.asMaterialsName,
          quantity: item?.asAnticipationMaterialCount,
          returnStatus: item?.returnStatus,
          price: item.asMaterialPrice,
          checked: false,
        };
      },
    );
    handleChangeItems(newProductMaterials);
  }, [afterService, memberName]);

  /**
   *
   * @param {*} addedMaterials is selected material list from the modal
   */
  const handleAddToMaterials = addedMaterials => {
    const newMaterials = [];
    const mergedMaterials = [...productMaterials, ...addedMaterials];
    mergedMaterials?.forEach(item => {
      const index = newMaterials?.findIndex(newItem => newItem?.id === item.id);
      if (index > -1) {
        newMaterials[index].quantity += 1;
      } else {
        newMaterials.push({ ...item });
      }
    });
    handleChangeItems(newMaterials);
  };

  const onSubmit = data => {
    const materialFee = productMaterials?.reduce((prev, current) => {
      return prev + current.price * current.quantity;
    }, 0);

    const anticipationMaterialsList = productMaterials?.map(item => {
      return {
        businessId,
        asMaterialId: item?.id,
        asReturnStatus: item?.returnStatus,
        asMaterialsCount: item?.quantity,
      };
    });

    const surchargeList = afterService?.surchargeList?.map(item => {
      return {
        surchargeType: item?.asSurchargeType,
        addSurchargeFee: item?.asSurchargeAddFee,
      };
    });

    const body = {
      ...data,
      anticipationMaterialsList,
      ASid: id,
      surchargeList,
      asStatus: 'AF',
      materialFee,
    };

    updateAterService(body);
  };
  /**
   * HANDLE CHECK VALIDATION FORM
   * IF ERRORS STATE EMPTY THEN OPEN CONFIRMATION MODAL
   * AND OTHERWHISE
   */
  const handleOnClickCompletion = () => {
    trigger().then(() => {
      if (isEmptyObject(errors)) {
        onToggleConfirmation();
      }
    });
  };

  if (isLoading || isFetching) {
    return <FullScreenLoader />;
  }

  if (!isLoading && isEmptyObject(afterService)) return <NoData />;

  if (isPortalOpen)
    return (
      <PortalWrapper headerLabel="사용 자재 추가" onClose={togglePortal}>
        <MaterialMobile
          onTogglePortal={togglePortal}
          onAddToMaterials={handleAddToMaterials}
        />
      </PortalWrapper>
    );
  return (
    <div id={ELEMENT_ID}>
      <h1 className="as-heading">A/S 조치결과 입력</h1>
      <Container className={`${storeStyles.container} wrapper-action-result`}>
        <div className="content">
          <form>
            <FormContent
              afterService={afterService}
              register={register}
              control={control}
              errors={errors}
              setValue={setValue}
            />
          </form>
          <MaterialSection
            productMaterials={productMaterials}
            handleChangeItems={handleChangeItems}
            handleChangeChecked={handleChangeChecked}
            handleChangeAllChecked={handleChangeAllChecked}
            onToggleMaterial={onToggleMaterial}
            onTogglePortal={togglePortal}
          />
          <div className="warning">
            <p>
              *고객님과 상담 당시 예상자재가 표기되어 있습니다.
              <br />
              실제 교환 품목과 다를 시 실제 교환된 품목으로 변경해주세요.
            </p>
          </div>
          <div className="footer-situation">
            <button
              type="submit"
              className="submit-situation case-warning"
              onClick={handleOnClickCompletion}
            >
              <span>조치 완료</span>
            </button>
          </div>
        </div>
      </Container>
      <MaterialModal
        isOpen={isOpenMaterial}
        onClose={onToggleMaterial}
        onAddToMaterials={handleAddToMaterials}
      />
      <ConfirmationModal
        isOpen={isOpenConfirmation}
        onClose={onToggleConfirmation}
        onConfirm={handleSubmit(onSubmit)}
        title="사용 자재가 맞는지 확인 하셨나요?"
      />
    </div>
  );
}

export default ActionResultCaseOne;
