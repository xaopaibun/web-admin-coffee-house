import { Form, Input, Select, SubmitButton } from 'formik-antd';
import { FormikProvider, useFormik } from 'formik';
import { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { useAppDispatch } from 'hooks';
import HeaderDashboard from 'components/Header';
import { loadingRef } from 'components/Loading';
import { Button, Image, Upload } from 'antd';
import { UploadChangeParam, UploadFile } from 'antd/lib/upload';
import { UploadOutlined } from '@ant-design/icons';
import { PayloadCreateProduct } from 'types';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { routes } from 'navigations/routes';
import { dashboardSelector } from '../selectors';
import { getDetailProductThunk, getListCategoryThunk, updateProductThunk } from '../thunk';
import CreateProductStyled from './styles';

const Update: FC = () => {
  const dispatch = useAppDispatch();
  const { listCategory, loading, product } = useSelector(dashboardSelector);

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      dispatch(getDetailProductThunk(id));
      dispatch(getListCategoryThunk({ limit: 10, page: 1 }));
    }
  }, [dispatch, id]);

  const { Option } = Select;

  const handleResetForm = () => formik.resetForm();

  const navigate = useNavigate();

  const { TextArea } = Input;

  useEffect(() => {
    formik.setFieldValue('name', product.name);
    formik.setFieldValue('category_id', product.category_id);
    formik.setFieldValue('image', product.image);
    formik.setFieldValue('price', product.price);
    formik.setFieldValue('content', product.content);
    formik.setFieldValue('slug', product.slug);
    formik.setFieldValue('star', product.star);
    formik.setFieldValue('information', product.information);
    formik.setFieldValue('stock', product.stock);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  const formik = useFormik<PayloadCreateProduct>({
    initialValues: {
      name: '',
      category_id: '',
      image: {} as File,
      price: 0,
      content: '',
      slug: '',
      star: 0,
      information: '',
      stock: 0,
    },
    onSubmit: async (values) => {
      // const { name, category_id, image, price, content, slug, star, information, stock } = values;
      // const formData = new FormData();
      // formData.append('name', name);
      // formData.append('category_id', category_id);
      // formData.append('image', new Blob([image as BlobPart]));
      // formData.append('price', price.toString());
      // formData.append('content', content);
      // formData.append('slug', slug);
      // formData.append('star', star.toString());
      // formData.append('information', information);
      // formData.append('stock', stock.toString());
      const resultAction = await dispatch(updateProductThunk({ id: id!, body: values as unknown }));
      if (updateProductThunk.fulfilled.match(resultAction)) {
        navigate(generatePath(routes.Dashboard.path, { entity: 'receiving' }));
      }
    },
  });

  useEffect(() => {
    loadingRef.current?.isLoading(loading);
  }, [loading]);

  return (
    <>
      <HeaderDashboard title="C???p nh???t th??ng tin s???n ph???m" className="header" />
      <CreateProductStyled>
        <FormikProvider value={formik}>
          <Form layout="vertical" autoComplete="off">
            <Form.Item
              name="name"
              label={
                <span className="text-label">
                  T??n s???n ph???m <span className="require">*</span>
                </span>
              }
              className="form-input"
            >
              <Input name="name" className="text-input" placeholder="Nh???p t??n s???n ph???m" />
            </Form.Item>
            <Form.Item
              name="category_id"
              label={
                <span className="text-label">
                  Lo???i s???n ph???m
                  <span className="require" />
                </span>
              }
              className="form-input"
            >
              <Select name="category_id" placeholder="Ch???n lo???i s???n ph???m" allowClear>
                {listCategory.map((item, index) => (
                  <Option key={index} value={item._id}>
                    {item.category_name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Upload
              name="image"
              accept=".jpeg, .png"
              showUploadList={false}
              beforeUpload={() => false}
              onChange={(value: UploadChangeParam<UploadFile<File>>) =>
                formik.setFieldValue('image', value.file)
              }
            >
              <Button icon={<UploadOutlined />}>Upload ???nh</Button>
            </Upload>
            {formik.values.image && (
              <Image
                src={
                  typeof formik.values.image === 'string'
                    ? formik.values.image
                    : URL.createObjectURL(new Blob([formik.values.image as BlobPart]))
                }
                alt="image"
                width={250}
                className="image"
              />
            )}
            <Form.Item
              name="slug"
              label={
                <span className="text-label">
                  Nh???p slug <span className="require">*</span>
                </span>
              }
              className="form-input"
            >
              <Input name="slug" className="text-input" placeholder="Nh???p slug" />
            </Form.Item>
            <Form.Item
              name="stock"
              label={
                <span className="text-label">
                  Nh???p stock <span className="require">*</span>
                </span>
              }
              className="form-input"
            >
              <Input name="stock" className="text-input" placeholder="Nh???p s??? l?????ng" />
            </Form.Item>
            <Form.Item
              name="price"
              label={
                <span className="text-label">
                  Nh???p gi?? b??n <span className="require">*</span>
                </span>
              }
              className="form-input"
            >
              <Input name="price" className="text-input" placeholder="Nh???p gi?? b??n" />
            </Form.Item>
            <Form.Item
              name="information"
              label={
                <span className="text-label">
                  Nh???p information <span className="require">*</span>
                </span>
              }
              className="form-input"
            >
              <TextArea
                rows={4}
                name="information"
                className="text-input"
                placeholder="Nh???p information"
              />
            </Form.Item>
            <Form.Item
              name="star"
              label={<span className="text-label">Nh???p star</span>}
              className="form-input"
            >
              <Input name="star" className="text-input" placeholder="Nh???p star" />
            </Form.Item>
            <Form.Item name="content" label="Nh???p n???i dung" className="form-input">
              <TextArea
                rows={4}
                name="content"
                className="text-input"
                placeholder="Nh???p n???i dung"
              />
            </Form.Item>
            <div className="wrap-submit">
              <div className="wrap-button">
                <SubmitButton className="btn btn_submit">C???p nh???t</SubmitButton>
                <button className="btn btn_close" type="button" onClick={handleResetForm}>
                  Hu??? b???
                </button>
              </div>
            </div>
          </Form>
        </FormikProvider>
      </CreateProductStyled>
    </>
  );
};

export default Update;
