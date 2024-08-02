import { StringDecoder } from 'string_decoder';
import { Request } from './request';
let user = JSON.parse(window.localStorage.getItem('user'))
//  请求的封装
export function login(parameter: any) {
  return Request.axiosInstance({
    url: '',
    method: 'post',
    data: parameter,
    transformRequest: [function (data) {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }]
  })
}
//查询列表
export function getList(parameter: any) {
  return Request.axiosInstance({
    url: '/config/policy/info/list',
    method: 'post',
    data: parameter,
  })
}
// 更新单个
export function updateOne(parameter: any) {
  return Request.axiosInstance({
    url: '/config/policy/info/mod',
    method: 'post',
    data: parameter,
  })
}
// 添加
export function addOne(parameter: any) {
  return Request.axiosInstance({
    url: '/config/policy/info/add',
    method: 'post',
    data: parameter,
  })
}
// 删除
export function removeOne(parameter: any) {
  return Request.axiosInstance({
    url: '/config/policy/info/remove',
    method: 'post',
    data: parameter,
  })
}
// 导出
export function policyExport(parameter: string) {
  return Request.axiosInstance({
    url: '/config/policy/info/export',
    method: 'post',
    data: {
      message: {
        id: parameter
      }
    },
  })
}
// 复制
export function policyCopy(originPolicyId: string, policyId: string) {
  return Request.axiosInstance({
    url: '/config/policy/info/copy',
    method: 'post',
    data: {
      message: {
        originPolicyId: originPolicyId,
        policyId: policyId,
      }
    },
  })
}
// 组件导入前的解析
export function policyImportresolve(file: any) {
  return Request.axiosInstance({
    url: '/config/policy/info/importresolve',
    method: 'post',
    data: {
      message: {
        attachment: file
      }
    },
  })
}
// 导入（校验编号重复）
export function policyImportCheck(list: Array<any>) {
  return Request.axiosInstance({
    url: '/config/policy/info/importwithcheck',
    method: 'post',
    data: {
      message: {
        list: list
      }
    },
  })
}
// 导入（不校验编号重复）
export function policyImportwithoutcheck(list: Array<any>) {
  return Request.axiosInstance({
    url: '/config/policy/info/importwithoutcheck',
    method: 'post',
    data: {
      message: {
        list: list
      }
    },
  })
}
// 单个查询
export function getOne(parameter: string) {
  return Request.axiosInstance({
    url: '/config/policy/info/one',
    method: 'post',
    data: {
      message: {
        id: parameter
      }
    },
  })
}
// 分页查询
export function getPage(parameter: object) {
  return Request.axiosInstance({
    url: '/config/policy/info/page',
    method: 'post',
    data: {
      message: {
        ...parameter
      }
    },
  })
}
export function logut() {
  return Request.axiosInstance({
    url: '/config/test/logout',
    method: 'post',
  })
}
// 根据id获取码值
export function codeById(idNmae: string) {
  return Request.axiosInstance({
    url: '/config/policy/code/id',
    method: 'post',
    data: {
      message: {
        id: idNmae
      }
    },
  })
}
// 根据id和码值配置获取码值
export function codeByMethod(parameter: object) {
  return Request.axiosInstance({
    url: '/config/policy/code/method',
    method: 'post',
    data: {
      message: {
        ...parameter
      }
    },
  })
}
// key使用坐标获取码值
export function codeByKey(idNmae: string) {
  return Request.axiosInstance({
    url: '/config/policy/code/coordinate',
    // url: '/config/policy/code/id',
    method: 'post',
    data: {
      message: {
        id: idNmae
      }
    },
  })
}
// 新增或更新码值
export function codeSave(items: any) {
  return Request.axiosInstance({
    url: '/config/code/save',
    method: 'post',
    data: {
      message: items
    },
  })
}
// 根据码值查询码值
export function codeList(codeNos: Array<any>) {
  return Request.axiosInstance({
    // url: '/code/doc',
    url: '/config/code/list',
    method: 'post',
    data: {
      message: {
        codeNos: codeNos
      }
    },
  })
}
// 产品树查询
export function productTree(id: string) {
  return Request.axiosInstance({
    url: '/config/product/info/tree',
    method: 'post',
    data: {
      message: {
        id: id
      }
    },
  })
}
// 产品目录树查询（根据机构编号查询）
export function productCatalogTree(id: string) {
  return Request.axiosInstance({
    url: '/config/product/catalog/tree',
    method: 'post',
    data: {
      message: {
        id: id
      }
    },
  })
}
// 产品基本信息查询
export function productTreeone(id: string) {
  return Request.axiosInstance({
    url: '/config/product/info/one',
    method: 'post',
    data: {
      message: {
        id: id
      }
    },
  })
}
// 产品基本信息删除（多个用，）
export function productTreeDel(id: string) {
  return Request.axiosInstance({
    url: '/config/product/info/del',
    method: 'post',
    data: {
      message: {
        id: id
      }
    },
  })
}
// 产品基本信息新增
export function productTreeAdd(message: object) {
  return Request.axiosInstance({
    url: '/config/product/info/add',
    method: 'post',
    data: {
      message: message
    },
  })
}
// 产品基本信息修改
export function productTreeEdit(message: object) {
  return Request.axiosInstance({
    url: '/config/product/info/mod',
    method: 'post',
    data: {
      message: message
    },
  })
}
// 产品政策关联信息分页查询
export function policeRelative(message: object) {
  return Request.axiosInstance({
    url: '/config/policy/relative/page',
    method: 'post',
    data: {
      message: message
    },
  })
}
// 产品政策关联信息查询
export function policeRelativeList(message: object) {
  return Request.axiosInstance({
    url: '/config/policy/relative/list',
    method: 'post',
    data: {
      message: message
    },
  })
}
// 产品新增政策
export function policeRelativeAdd(policyId: string, originPolicyId: string, objectNo: string,) {
  return Request.axiosInstance({
    // url: '/config/policy/relative/copypolicy',
    url: '/config/policy/relative/addpolicy',
    method: 'post',
    data: {
      message: {
        policyId: policyId,
        relativeType: '1',
        objectType: '1',
        objectNo: objectNo,
        originPolicyId: originPolicyId,
      }
    },
  })
}
// 产品政策更新
export function policeRelativeModpolicy(relevanceNumber: string, policyId: string, objectNo: string, info: object) {
  // export function policeRelativeModpolicy(relevanceNumber: string, policyId: string, objectNo: string, originPolicyId: string, info: object) {
  return Request.axiosInstance({
    url: '/config/policy/relative/modpolicy',
    method: 'post',
    data: {
      message: {
        id: relevanceNumber,
        policyId: policyId,
        relativeType: '1',
        objectType: '1',
        objectNo: objectNo,
        status: '0',
        // originPolicyId: originPolicyId,
        info: info
      }
    },
  })
}
// 产品政策删除
export function policeRelativeDel(id: string, policyId: string) {
  return Request.axiosInstance({
    url: '/config/policy/relative/delpolicy',
    method: 'post',
    data: {
      message: {
        policyId: policyId,
        id: id
      }
    },
  })
}
//  政策关联信息查询
export function policeRelativeOne(id: string) {
  return Request.axiosInstance({
    url: '/config/policy/relative/one',
    method: 'post',
    data: {
      message: {
        id: id
      }
    },
  })
}
// 政策关联信息新增
export function policeRelativeAddition(policyId: string, objectNo: string, objectType: string, relativeType: string) {
  return Request.axiosInstance({
    url: '/config/policy/relative/add',
    method: 'post',
    data: {
      message: {
        policyId: policyId,
        relativeType: relativeType,
        objectType: objectType,
        objectNo: objectNo,
        status: '0'
      }
    },
  })
}
//  政策关联信息删除
export function policeRelativeRemove(id: string) {
  return Request.axiosInstance({
    url: '/config/policy/relative/remove',
    method: 'post',
    data: {
      message: {
        id: id
      }
    },
  })
}

//  政策关联信息更新
export function policeRelativeMod(id: string, policyId: string, objectNo: string, objectType: string, relativeType: string) {
  return Request.axiosInstance({
    url: '/config/policy/relative/mod',
    method: 'post',
    data: {
      message: {
        id: id,
        policyId: policyId,
        relativeType: relativeType,
        objectType: objectType,
        objectNo: objectNo,
        status: '0'
      }
    },
  })
}

//  政策关联文档列表查询
export function policeRelativeDocList(id: string) {
  return Request.axiosInstance({
    url: '/config/policy/relative/doc/list',
    method: 'post',
    data: {
      message: {
        id: id
      }
    },
  })
}
//  政策关联文档删除
export function policeAttachmentDownload(id: string) {
  return Request.axiosInstance({
    url: '/config/attachment/download',
    method: 'post',
    data: {
      message: {
        id: id
      }
    },
  })
}
//  产品流程待处理列表分页查询
export function flowTodoList(begin: any, pageSize: any, flowPhase: string,) {
  // export function flowTodoList(begin: any, pageSize: any, productId: string, productName: string, policyId: string, policyName: string, flowPhase: string,) {
  return Request.axiosInstance({
    url: '/config/product/flow/todolist',
    method: 'post',
    data: {
      message: {
        begin: begin,
        pageSize: pageSize,
        orderBy: [],
        // query_productId: {
        //   name: 'productId',
        //   value: productId,
        //   queryFilterType: 'equals'
        // },
        // query_productName: {
        //   name: 'productName',
        //   value: productName,
        //   queryFilterType: 'equals'
        // },
        // query_policyId: {
        //   name: 'policyId',
        //   value: policyId,
        //   queryFilterType: 'equals'
        // },
        // query_policyName: {
        //   name: 'policyName',
        //   value: policyName,
        //   queryFilterType: 'equals'
        // },
        flowPhase: flowPhase,
      }
    },
  })
}
//  产品流程已处理列表分页查询
export function flowDoneList(begin: any, pageSize: any, flowPhase: string,) {
  // export function flowTodoList(begin: any, pageSize: any, productId: string, productName: string, policyId: string, policyName: string, flowPhase: string,) {
  return Request.axiosInstance({
    url: '/config/product/flow/donelist',
    method: 'post',
    data: {
      message: {
        begin: begin,
        pageSize: pageSize,
        orderBy: [],
        // query_productId: {
        //   name: 'productId',
        //   value: productId,
        //   queryFilterType: 'equals'
        // },
        // query_productName: {
        //   name: 'productName',
        //   value: productName,
        //   queryFilterType: 'equals'
        // },
        // query_policyId: {
        //   name: 'policyId',
        //   value: policyId,
        //   queryFilterType: 'equals'
        // },
        // query_policyName: {
        //   name: 'policyName',
        //   value: policyName,
        //   queryFilterType: 'equals'
        // },
        flowPhase: flowPhase,
      }
    },
  })
}
//  产品流程新增
export function productFlowAdd(taskType: string, objectType: string, objectNo: string, remark: string, ext: Object) {
  return Request.axiosInstance({
    url: '/config/product/flow/newapply',
    method: 'post',
    data: {
      message: {
        taskType: taskType,
        objectType: objectType,
        objectNo: objectNo,
        remark: remark,
        ext: {
          productId: ext.productId,
          policyId: ext.policyId,
          operate: ext.operate,
        },
      }
    },
  })
}
// //  产品流程新增
// export function productFlowAdd(productId: string, policyId: string, remark: string) {
//   return Request.axiosInstance({
//     url: '/config/product/flow/init',
//     method: 'post',
//     data: {
//       message: {
//         productId: productId,
//         policyId: policyId,
//         remark: remark,
//       }
//     },
//   })
// }
//  产品流程取消（id为流程实例编号）
export function productFlowCancel(id: string) {
  return Request.axiosInstance({
    url: '/config/product/flow/cancel',
    method: 'post',
    data: {
      message: {
        id: id
      }
    },
  })
}
//  产品流程提交
export function productFlowSubmit(flowItemId: string, flowInstanceId: string, flowPhase: string, taskType: String) {
  return Request.axiosInstance({
    url: '/config/product/flow/submit',
    method: 'post',
    data: {
      message: {
        flowItemId: flowItemId,
        flowInstanceId: flowInstanceId,
        flowPhase: flowPhase,
        taskType: taskType
      }
    },
  })
}
//  产品信息分页查询
export function productInfoPage(begin: any, pageSize: any) {
  return Request.axiosInstance({
    url: '/config/product/info/page',
    method: 'post',
    data: {
      message: {
        begin: begin,
        pageSize: pageSize,
        orderBy: [],
        orgId: user.orgId,
      }
    },
  })
}
//  产品流程工作项信息查询（可用于当前流程意见查询）
export function productFlowItemInfo(id: string) {
  return Request.axiosInstance({
    url: '/config/product/flowitem/info',
    method: 'post',
    data: {
      message: {
        id: id
      }
    },
  })
}
//  产品流程工作项信息查询（可用于历史意见查询）
export function productFlowItemList(id: string) {
  return Request.axiosInstance({
    url: '/config/product/flowitem/list',
    method: 'post',
    data: {
      message: {
        id: id
      }
    },
  })
}
//  产品流程工作项信息保存（可用于意见保存）
export function productFlowItemMod(id: string, flowInstanceId: string, opinion: string, detail: string, flowPhase: string) {
  return Request.axiosInstance({
    url: '/config/product/flowitem/mod',
    method: 'post',
    data: {
      message: {
        id: id,
        flowInstanceId: flowInstanceId,
        opinion: opinion,
        detail: detail,
        flowPhase: flowPhase,
      }
    },
  })
}
// 法人机构树
export function querycorporationtree() {
  return Request.axiosInstance({
    url: '/system/org/querycorporationtree',
    method: 'post',
    data: {
      message: {
      }
    },
  })
}
//  机构树
export function queryorgTree() {
  return Request.axiosInstance({
    url: '/system/org/queryorgtree',
    method: 'post',
    data: {
      message: {

      }
    },
  })
}
