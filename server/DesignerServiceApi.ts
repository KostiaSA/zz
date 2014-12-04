/**
 * Created by user on 02.12.2014.
 */

enum DesignerCmd {GetAppDirTree}
enum DesignerResult {Ok, Error}

class BaseDesignerRequest {
    username:string;
    cmd:DesignerCmd;
}

class BaseDesignerResponse {
    result:DesignerResult;
    error:string;
}

class GetAppDirTreeDesignerRequest extends BaseDesignerRequest {
    cmd:DesignerCmd = DesignerCmd.GetAppDirTree;
}

class GetAppDirTreeDesignerResponse extends BaseDesignerResponse{
    dirtree:any;
}
