import Footer from '@/components/Footer';
import {
  userLoginUsingPOST,
  userRegisterUsingPOST
} from '@/services/twintea-api-backend/userController';
import {LockOutlined, UserOutlined} from '@ant-design/icons';
import {
  LoginFormPage,
  ProFormCheckbox,
  ProFormInstance,
  ProFormText
} from '@ant-design/pro-components';
import {useModel} from '@umijs/max';
import {Button, message, Spin, Tabs, Tooltip} from 'antd';
import type {CSSProperties} from 'react';
import React, {useEffect, useRef, useState} from 'react';

import {loginCaptchaUsingGET, registerCaptchaUsingGET} from "@/services/twintea-api-backend/captchaController";

type LoginType = 'account' | 'register' | 'forgetPassword';

const iconStyles: CSSProperties = {
  color: 'rgba(0, 0, 0, 0.2)',
  fontSize: '18px',
  verticalAlign: 'middle',
  cursor: 'pointer',
};

const Login: React.FC = () => {
  const {initialState, setInitialState} = useModel('@@initialState');
  const [loginType, setLoginType] = useState<LoginType>('account');
  const formRef = useRef<ProFormInstance>();
  const [loginCaptchaUrl, setLoginCaptchaUrl] = useState<string>('');
  const [registerCaptchaUrl, setRegisterCaptchaUrl] = useState<string>('');
  const timestamp = new Date().getTime();
  const [loginCaptchaKey, setLoginCaptchaKey] = useState<string>('');
  const [registerCaptchaKey, setRegisterCaptchaKey] = useState<string>('');
  const [loading, setLoading] = useState(false);



  /**
   * 图片加载
   */
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  /**
   * 生成 登录的验证码
   */
  const getLoginCaptcha = async () => {
    setLoading(true);
    const loginCaptcha = await loginCaptchaUsingGET({time: timestamp});
    if (loginCaptcha.code === 0) {
      setLoginCaptchaUrl(loginCaptcha.data.base64Img);
      setLoginCaptchaKey(loginCaptcha.data.captchaKey)
      console.log("Login:captchaKey: " + loginCaptchaKey)
    } else {
      message.error(loginCaptcha.message);
    }
    setLoading(false);
  }


  const getRegisterCaptcha = async () => {
    setLoading(true);
    const registerCaptcha = await registerCaptchaUsingGET({time: timestamp});
    if (registerCaptcha.code === 0) {
      setRegisterCaptchaUrl(registerCaptcha.data.base64Img);
      setRegisterCaptchaKey(registerCaptcha.data.captchaKey);
    } else {
      message.error(registerCaptcha.message);
    }
    setLoading(false);
  }

  useEffect(() => {
    const image = new Image();
    image.src = 'https://static-bed.twintea.top/wallpaper/0fc02ec832975344346ecf8cda05ee18.jpg';
    image.onload = () => {
      setImageLoading(false);
    };
    getLoginCaptcha();
  }, []);

  const handleSubmit = async (values: API.UserLoginAndRegisterRequest) => {
    const {userAccount, userPassword, checkPassword, isRemember, captchaCode, captchaKey} = values;
    if (checkPassword) {
      values.captchaKey = registerCaptchaKey;
      // 注册
      if (userPassword !== checkPassword) {
        message.error('两次输入密码不一致！');
        return;
      }
      const res = await userRegisterUsingPOST(values);

      if (res.code === 0) {
        // 注册成功
        // 切换到登录
        setLoginType('account');
        // 重置表单
        formRef.current?.resetFields();
      } else {
        //提交之后（进入后端）失败刷新验证码
        await getRegisterCaptcha();
      }
    } else {

      values.captchaKey = loginCaptchaKey;
      // 登录
      const res = await userLoginUsingPOST({
        ...values,
      });
      if (res.data) {
        // 登录成功后处理
        const urlParams = new URL(window.location.href).searchParams;
        // 重定向到 redirect 参数所在的位置
        location.href = urlParams.get('redirect') || '/';
        // 保存登录状态
        setInitialState({
          loginUser: res.data.loginUser,
        });
      } else {
        //提交之后（进入后端）失败刷新验证码
        await getLoginCaptcha();
      }
    }
  };

  const handleLoginType = async (activeKey) => {
    setLoginType(activeKey as LoginType)
    if (activeKey === 'account') {
      getLoginCaptcha();
    } else if (activeKey === 'register') {
      getRegisterCaptcha();
    }
  }

  //自定义LoginForm，submit按钮的值，使登录场景显示登录字样，注册场景显示注册字样
  const submitterRender = (props, defaultDoms) => {
    return [
      <Button block key="submit" type="primary" onClick={() => props.form?.submit()}>
        {loginType === 'account' ? '登录' : '注册'}
      </Button>,
    ];
  };

  return (
    <div>
      {imageLoading ? (
        <Spin size="large"/>
      ) : (
        <div
          style={{
            backgroundColor: 'white',
            height: 'calc(100vh - 100px)',
            margin: 0,
          }}
        >

          {/*ProComponents 高级组件： LoginFormPage*/}
          <LoginFormPage
            // backgroundImageUrl={twinteaImg}
            backgroundImageUrl='https://static-bed.twintea.top/wallpaper/0fc02ec832975344346ecf8cda05ee18.jpg'
            logo="http://pic.twintea.top/apiProjectAvatar/2023/09/04/IdtaalRaZAAsx6B.png"
            // logo={logo}
            title="Twintea API"
            subTitle="全洛圣都最好用的免费API接口平台"
            formRef={formRef}
            initialValues={{
              isRemember: true,
            }}
            //自定义LoginForm按钮的值，登录显示登录，注册显示注册
            submitter={{
              render: submitterRender,
            }}
            onFinish={async (values) => {
              await handleSubmit(values as API.UserLoginAndRegisterRequest);
            }}
          >

            {
              <Tabs
                centered
                activeKey={loginType}
                // onChange={(activeKey) => setLoginType(activeKey as LoginType)}
                onChange={(activeKey) => handleLoginType(activeKey)}
              >
                <Tabs.TabPane key={'account'} tab={'登录'}/>
                <Tabs.TabPane key={'register'} tab={'注册'}/>
              </Tabs>
            }
            {loginType === 'account' && (
              <>
                <ProFormText
                  name="userAccount"
                  fieldProps={{
                    size: 'large',
                    prefix: <UserOutlined/>,
                  }}
                  placeholder={'请输入用户名'}
                  rules={[
                    {
                      required: true,
                      message: '用户名是必填项！',
                    },
                    {
                      min: 4,
                      message: '用户名至少4位'
                    },
                    {
                      max: 20,
                      message: '用户名过长'
                    },
                  ]}
                />
                <ProFormText.Password
                  name="userPassword"
                  fieldProps={{
                    size: 'large',
                    prefix: <LockOutlined/>,
                  }}
                  placeholder={'请输入密码'}
                  rules={[
                    {
                      required: true,
                      message: '密码是必填项！',
                    },
                    {
                      min: 8,
                      message: '密码不少于8位！',
                    },
                    {
                      max: 50,
                      message: '密码过长！',
                    },
                  ]}
                />

                <div style={{display: "flex"}}>
                  <ProFormText
                    fieldProps={{
                      size: 'large',
                      prefix: <LockOutlined className={'prefixIcon'}/>,
                    }}
                    name="captchaCode"
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
                  <img src={loginCaptchaUrl} onClick={getLoginCaptcha} style={{marginLeft: 18}} width="100px"
                       height="39px"/>
                </div>

                <div
                  style={{
                    marginBottom: 24,
                  }}
                >
                  <ProFormCheckbox noStyle name="isRemember">
                    记住我
                  </ProFormCheckbox>
                  <Tooltip placement={"bottom"} title={'请联系管理员'}>
                    <a
                      style={{
                        float: 'right',
                      }}
                      // onClick={() => setLoginType('forgetPassword')}

                    >
                      忘记密码 ?
                    </a>
                  </Tooltip>
                </div>
              </>
            )}
            {loginType === 'register' && (
              <>
                <ProFormText
                  fieldProps={{
                    size: 'large',
                    prefix: <UserOutlined/>,
                  }}
                  name="userAccount"
                  placeholder={'请输入用户名'}
                  rules={[
                    {
                      required: true,
                      message: '用户名是必填项！',
                    },
                    {
                      min: 4,
                      message: '用户名不能少于4位！',
                    },
                    {
                      max: 20,
                      message: '用户名过长'
                    },
                  ]}
                />
                <ProFormText.Password
                  fieldProps={{
                    size: 'large',
                    prefix: <LockOutlined/>,
                  }}
                  name="userPassword"
                  placeholder={'请输入密码'}
                  rules={[
                    {
                      required: true,
                      message: '密码是必填项！',
                    },
                    {
                      min: 8,
                      message: '密码不能少于8位！',
                    },
                    {
                      max: 50,
                      message: '密码过长！',
                    },
                  ]}
                />
                <ProFormText.Password
                  fieldProps={{
                    size: 'large',
                    prefix: <LockOutlined/>,
                  }}
                  name="checkPassword"
                  placeholder={'请再次输入密码'}
                  rules={[
                    {
                      required: true,
                      message: '密码是必填项！',
                    },
                    {
                      min: 8,
                      message: '密码不能少于8位！',
                    },
                    {
                      max: 50,
                      message: '密码过长！',
                    },
                  ]}
                />
                <div style={{display: "flex"}}>
                  <ProFormText
                    fieldProps={{
                      size: 'large',
                      prefix: <LockOutlined className={'prefixIcon'}/>,
                    }}
                    name="captchaCode"
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
                  <img src={registerCaptchaUrl} onClick={getRegisterCaptcha} style={{marginLeft: 18}} width="100px"
                       height="39px"/>
                </div>
              </>
            )}
          </LoginFormPage>
        </div>
      )}
      <Footer/>
    </div>
  );
};
export default Login;
