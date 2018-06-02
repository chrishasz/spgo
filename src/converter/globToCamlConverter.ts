'use strict';

export class GlobToCamlConverter {

    static Convert(glob : any, spSitePath : string) : string {
        
        let camlQuery : string = '';

        //Limitation - can only support Neq for specific filenames.
        if(glob.is.negated){
            camlQuery = this.queryNotEqual(() => this.getFieldRef, glob.path.basename);
        }
        else if(!glob.is.negated){
            if(glob.path.filename == '*'){
                // looking for all files: *, *.*
                if(glob.path.extname == '*' || glob.path.extname == ''){
                    camlQuery = '';
                }
                //trim out *, and create like: *.css => .css
                else{
                    camlQuery = this.queryLike(this.getFieldRef, glob.path.basename.replace(/\*/gi,''));
                }
            }
            else{
                // looking for single basename: fileName.*
                if(glob.path.extname == '*'){
                    camlQuery = this.queryLike(this.getFieldRef, glob.path.basename);
                }
                // looking for a single file: filename.ext
                else{
                    camlQuery = this.queryEqual(this.getFieldRef, glob.path.basename);
                }
            }

            //check to see if this is a single folder or not
            if(!glob.is.globstar && camlQuery != ''){
                camlQuery = this.combineAnd(this.queryEqual(this.getFileDirRef, spSitePath + glob.base), camlQuery );
            }
        }
        
        return camlQuery;
    }

    private static combineAnd(firstQuery:string, secondQuery:string){
        return `<And>${firstQuery}${secondQuery}</And>`;
    }

    private static queryEqual(operation : Function, value:string){
        return `<Eq>${operation()}${this.getValue(value)}</Eq>`;
    }

    private static queryLike(operation : Function, value:string){
        return `<Contains>${operation()}${this.getValue(value)}</Contains>`;
    }

    private static queryNotEqual(operation : Function, value:string){
        return `<Neq>${operation()}${this.getValue(value)}</Neq>`;
    }

    private static getFileDirRef(){
        return '<FieldRef Name="FileDirRef"/>';
    }

    private static getFieldRef(){
        return '<FieldRef Name="FileLeafRef"/>';
    }

    private static getValue(value:string){
        return `<Value Type="Text">${value}</Value>`;
    }
}