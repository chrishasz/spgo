'use strict';

export class GlobToCamlConverter {

    static Convert(glob : any) : string {
        
        let camlQuery : string = '';

        //Limitation - can only support Neq for specific filenames.
        if(glob.is.negated){
            camlQuery = this.queryNotEqual(glob.path.basename);
        }
        else if(!glob.is.negated){
            if(glob.path.filename == '*'){
                // looking for all files: *, *.*
                if(glob.path.extname == '*' || glob.path.extname == ''){
                    camlQuery = '';
                }
                //trim out *, and create like: *.css => .css
                else{
                    camlQuery = this.queryLike(glob.path.basename.replace(/\*/gi,''));
                }
            }
            else{
                // looking for single basename: fileName.*
                if(glob.path.extname == '*'){
                    camlQuery = this.queryLike(glob.path.basename);
                }
                // looking for a single file: filename.ext
                else{
                    camlQuery = this.queryEqual(glob.path.basename);
                }
            }
        }
        
        return camlQuery;
    }

    private static queryEqual(value:string){
        return `<Eq>${this.getFieldRef()}${this.getValue(value)}</Eq>`;
    }

    private static queryLike(value:string){
        return `<Contains>${this.getFieldRef()}${this.getValue(value)}</Contains>`;
    }

    private static queryNotEqual(value:string){
        return `<Neq>${this.getFieldRef()}${this.getValue(value)}</Neq>`;
    }

    private static getFieldRef(){
        return '<FieldRef Name="FileLeafRef"/>';
    }

    private static getValue(value:string){
        return `<Value Type="Text">${value}</Value>`;
    }
}