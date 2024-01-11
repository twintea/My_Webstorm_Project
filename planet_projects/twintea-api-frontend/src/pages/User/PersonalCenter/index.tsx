import {
  getUserVOByIdUsingGET,
  showSecretKeyUsingPOST,
  updatePwdUsingPOST,
  updateSecretKeyUsingPOST,
  updateUserUsingPOST,
  userLogoutUsingPOST,
} from '@/services/twintea-api-backend/userController';
import { useModel } from '@@/exports';
import {
  CommentOutlined,
  EditOutlined,
  FieldTimeOutlined,
  LoadingOutlined,
  LockOutlined,
  PlusOutlined,
  UnlockOutlined,
  UserOutlined,
  VerifiedOutlined,
} from '@ant-design/icons';
import { PageContainer, ProForm, ProFormInstance, ProFormText } from '@ant-design/pro-components';
import {
  Button,
  Card,
  Col,
  Divider,
  message,
  Modal,
  Row,
  Typography,
  Upload,
  UploadFile,
  UploadProps,
} from 'antd';
import { RcFile, UploadChangeParam } from 'antd/es/upload';
import React, { useEffect, useRef, useState } from 'react';
import { history } from 'umi';
import {timestamp} from "rxjs";
import {baseCaptchaUsingGET, resetAkSkCaptchaUsingGET} from "@/services/twintea-api-backend/captchaController";


const { Paragraph } = Typography;

const avatarStyle: React.CSSProperties = {
  width: '100%',
  textAlign: 'center',
};
const buttonStyle: React.CSSProperties = {
  marginLeft: '30px',
};
const uploadUrl = 'http://localhost:7529/api/file/upload';

/**
 * 上传前校验
 * @param file 文件
 */
const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('仅允许上传 JPG/PNG 格式的文件!');
  }
  const isLt2M = file.size / 1024 / 1024 < 5;
  if (!isLt2M) {
    message.error('文件最大上传大小为 5MB!');
  }
  return isJpgOrPng && isLt2M;
};

const Profile: React.FC = () => {
  const [data, setData] = useState<API.UserVO>({});
  const [aksk, setsecretKey] = useState<API.UserSecretKeyVO>({});
  const [visible, setVisible] = useState<boolean>(false);
  const [flag, setFlag] = useState<boolean>(false);
  const [skOpen, setSkOpen] = useState<boolean>(false);
  const [updatePwdOpen, setUpdatePwdOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const { initialState, setInitialState } = useModel('@@initialState');
  const [captchaUrl, setCaptchaUrl] = useState<string>('');
  const [captchaId, setCaptchaId] = useState<string>('');

  const formRef = useRef<
    ProFormInstance<{
      userPassword: string;
      captcha: string;
    }>
  >();

  const updatePwdformRef = useRef<
    ProFormInstance<{
      oldPassword: string;
      newPassword: string;
      checkNewPassword: string;
    }>
  >();


  //获取验证码：
  const getCaptcha = async (id: any) => {
    try {
    const res = await resetAkSkCaptchaUsingGET({time: timestamp, id: id});
    if (res.code === 0) {
      setCaptchaUrl(res.data.base64Img);
      setCaptchaId(res.data.captchaKey)
    } else {
      message.error(res.message);
    }
    }catch (error: any){
      message.error('获取验证码失败');
    }
  }

  // 获取用户信息
  const getUserInfo = async (id: any) => {
    return getUserVOByIdUsingGET({ id }).then((res) => {
      if (res.data) {
        setInitialState((s: any) => ({ ...s, loginUser: res.data }));
        setData(res.data);
        setImageUrl(res.data.userAvatar);
      }
    });
  };

  useEffect(() => {
    try {
     getUserInfo(initialState?.loginUser?.id).then(res =>{});
    } catch (e: any) {
      console.log(e);
    }
  }, []);


  // 显示秘钥
  const showSecretKey = async () => {
    let userPassword = formRef?.current?.getFieldValue('userPassword');

    // 登录
    // const res = await userLoginUsingPOST({
    //     userAccount: data?.userAccount,
    //     userPassword: userPassword,
    // });
    // if (res.code === 0) {

    //校验密码已交给后端去完成
    const res = await showSecretKeyUsingPOST({
      id: data?.id,
      password: userPassword,
    });
    if (res.data) {
      setsecretKey(res.data);
      setSkOpen(false);
      setVisible(true);
      formRef?.current?.resetFields();
    }

    // }
  };

  //更新密码
  const updatePwd = async () => {
    let oldPassword = updatePwdformRef?.current?.getFieldValue('oldPassword');
    let newPassword = updatePwdformRef?.current?.getFieldValue('newPassword');
    let checkNewPassword = updatePwdformRef?.current?.getFieldValue('checkNewPassword');
    if (oldPassword === newPassword) {
      message.error('新密码不能与现密码一致！');
      return;
    }
    if (newPassword !== checkNewPassword) {
      message.error('两次输入的新密码不一致！');
      return;
    }
    const res = await updatePwdUsingPOST({
      id: data?.id,
      oldPassword: oldPassword,
      newPassword: newPassword,
      checkNewPassword: checkNewPassword,
    });
    if (res.data) {
      message.success('密码修改成功！');
      message.success('请重新登录');
      setUpdatePwdOpen(false);
      updatePwdformRef?.current?.resetFields();
      await userLogoutUsingPOST();
      history.push({
        pathname: '/user/login',
      });
    }
  };

  // 更新用户头像
  const updateUserAvatar = async (id: number, userAvatar: string) => {
    // 更新用户头像
    const res = await updateUserUsingPOST({
      id,
      userAvatar,
    });
    if (res.code !== 0) {
      message.success(`更新用户头像失败`);
    } else {
      await getUserInfo(id);
    }
  };

  /**
   * 上传图片
   * @param info
   */
  const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // const res = await uploadFileUsingPOST({
      //     file: info.file.originFileObj as any
      // })
      if (info.file.response.code === 0) {
        message.success(`上传成功`);
        const id = initialState?.loginUser?.id as number;
        const userAvatar = info.file.response.data;
        setLoading(false);
        setImageUrl(userAvatar);
        updateUserAvatar(id, userAvatar);
      }
    }else if (info.file.status === 'error') {
      message.error(`${info.file.name} 上传失败.`);
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  // 重置秘钥
  const resetSecretKey = async () => {
    try {
      let userPassword = formRef?.current?.getFieldValue('userPassword');
      let captcha = formRef?.current?.getFieldValue('captcha');
      // 登录
      // const res = await userLoginUsingPOST({
      //     userAccount: data?.userAccount,
      //     userPassword: userPassword,
      // });
      // if (res.code === 0) {
      const res = await updateSecretKeyUsingPOST({
        userId: data?.id,
        password: userPassword,
        captchaCode: captcha,
        captchaKey: captchaId,
      });
      //不论是否成功，刷新验证码
      getCaptcha(data?.id);
      if (res.data) {
        // getUserInfo(data?.id);
        message.success('重置成功！');
        showSecretKey();
        setSkOpen(false);
      }
      // }
    } catch (e: any) {
      console.log(e);
    }
  };
  return (
    <PageContainer>
      <Row gutter={24}>
        <Col span={8}>
          <Card title="个人信息" bordered={false}>
            <Row>
              <Col style={avatarStyle}>
                <Upload
                  name="file"
                  listType="picture-circle"
                  showUploadList={false}
                  action={uploadUrl}
                  beforeUpload={beforeUpload}
                  onChange={handleChange}
                >
                  {imageUrl ? (
                    <img
                      src={data?.userAvatar}
                      alt="avatar"
                      style={{ width: '100%', borderRadius: '50%' }}
                    />
                  ) : (
                    uploadButton
                  )}
                </Upload>
              </Col>
            </Row>
            <Divider />
            <Row>
              <Col>
                <UserOutlined /> 用户名称：{data?.userName}
              </Col>
            </Row>
            <Divider />
            <Row>
              <Col>
                <CommentOutlined /> 用户账号：{data?.userAccount}
              </Col>
            </Row>
            <Divider />
            <Row>
              <Col>
                <VerifiedOutlined /> 用户角色：{data?.userRole}
              </Col>
            </Row>
            <Divider />
            <Row>
              <Col>
                <FieldTimeOutlined /> 注册时间：{data?.createTime}
              </Col>
            </Row>
            <Divider />
            <Row>
              <Col>
                <EditOutlined />{' '}
                <Button
                  type="primary"
                  onClick={() => {
                    setUpdatePwdOpen(true);
                  }}
                >
                  修改密码
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={16}>
          <Card title="秘钥操作" bordered={false}>
            <Row>
              <Col>
                {visible ? (
                  <Paragraph
                    copyable={{
                      text: aksk?.accessKey,
                    }}
                  >
                    <LockOutlined /> accessKey：{aksk?.accessKey}
                  </Paragraph>
                ) : (
                  <Paragraph>
                    <UnlockOutlined /> accessKey：*********
                  </Paragraph>
                )}
              </Col>
            </Row>
            <Divider />
            <Row>
              <Col>
                {visible ? (
                  <Paragraph
                    copyable={{
                      text: aksk?.secretKey,
                    }}
                  >
                    <UnlockOutlined /> secretKey：{aksk?.secretKey}
                  </Paragraph>
                ) : (
                  <Paragraph>
                    <UnlockOutlined /> secretKey：*********
                  </Paragraph>
                )}
              </Col>
            </Row>
            <Divider />
            <Row>
              <Col>
                {!visible ? (
                  <Button
                    type="primary"
                    onClick={() => {
                      setSkOpen(true);
                      getCaptcha(data?.id);
                      setFlag(true);
                    }}
                  >
                    查看秘钥
                  </Button>
                ) : (
                  <Button type="primary" onClick={() => setVisible(false)}>
                    隐藏秘钥
                  </Button>
                )}
                <Button
                  style={buttonStyle}
                  onClick={() => {
                    setSkOpen(true);
                    getCaptcha(data?.id);
                    setFlag(false);
                  }}
                  type="primary"
                  danger
                >
                  重置秘钥
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      <Modal
        title={flag ? '查看秘钥' : '重置密钥'}
        open={skOpen}
        onOk={flag ? showSecretKey : resetSecretKey}
        onCancel={() => setSkOpen(false)}
      >
        <ProForm<{
          userPassword: string;
        }>
          formRef={formRef}
          formKey="check-user-password-form"
          autoFocusFirstInput
          submitter={{
            resetButtonProps: {
              style: {
                display: 'none',
              },
            },
            submitButtonProps: {
              style: {
                display: 'none',
              },
            },
          }}
        >
          <ProFormText.Password
            name="userPassword"
            placeholder="请输入用户密码"
            rules={[{ required: true, message: '密码为必填项!' }]}
          />
          <div style={{display:"flex"}}>
            <ProFormText
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined className={'prefixIcon'} />,
              }}
              name="captcha"
              placeholder={'请输入右侧验证码'}
              rules={[
                {
                  required: true,
                  message: '请输入图形验证码！',
                },
                // {
                //   pattern: /^[0-9]\d{3}$/,
                //   message: '验证码格式错误！',
                // },
              ]}
            />
            <img src={captchaUrl} onClick={() =>getCaptcha(data.id)} style={{marginLeft:18, cursor: 'pointer' }} width="130px" height="39px"/>
          </div>
        </ProForm>
      </Modal>

      <Modal
        title="修改密码"
        open={updatePwdOpen}
        onOk={updatePwd}
        onCancel={() => setUpdatePwdOpen(false)}
      >
        <ProForm<{
          oldPassword: string;
          newPassword: string;
          checkNewPassword: string;
        }>
          formRef={updatePwdformRef}
          formKey="update-user-password-form"
          autoFocusFirstInput
          submitter={{
            resetButtonProps: {
              style: {
                display: 'none',
              },
            },
            submitButtonProps: {
              style: {
                display: 'none',
              },
            },
          }}
        >
          <ProFormText.Password
            label={'原密码'}
            name="oldPassword"
            placeholder="请输入现在的用户密码"
            rules={[
              { required: true, message: '密码为必填项!' },
              { min: 8, message: '密码长度不小于8位' },
            ]}
          />
          <ProFormText.Password
            label={'新密码'}
            name="newPassword"
            placeholder="请输入新密码"
            rules={[
              { required: true, message: '密码为必填项!' },
              { min: 8, message: '密码长度不小于8位' },
            ]}
          />
          <ProFormText.Password
            label={'确认新密码'}
            name="checkNewPassword"
            placeholder="请再次输入新密码"
            rules={[
              { required: true, message: '密码为必填项!' },
              { min: 8, message: '密码长度不小于8位' },
            ]}
          />
        </ProForm>
      </Modal>
    </PageContainer>
  );
};

export default Profile;
